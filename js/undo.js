//==============================================================
// undo/redo framework
//==============================================================

class Action {
    constructor() {
        this.fromViewCenter = getViewCenter();
    }

	undoAction() {
		throw "not implemented";
	}

	redoAction() {
		throw "not implemented";
	}

	toString() {
		throw "not implemented";
	}
}

var undoStack = Array();
var redoStack = Array();
var maxUndoStackSize = 250;
var undoCombos = [];

function updateUndoRedoButton(button, stack, prefix) {
	if (stack.length > 0) {
		button.className = "button";
		button.children[0].title = prefix + " " + stack[stack.length - 1].toString();

	} else {
		button.className = "button-disabled";
		button.alt = prefix;
	}
}

function updateButtons() {
	updateUndoRedoButton(document.getElementById("undoButton"), undoStack, "Undo");
	updateUndoRedoButton(document.getElementById("redoButton"), redoStack, "Redo");
}

function addUndoAction(action, fromViewCenter=null) {
    // check if there's a combo in progress
    if (undoCombos.length > 0) {
        // put in the combo
        undoCombos[undoCombos.length - 1].push(action);
        return;
    }

    if (fromViewCenter) {
        action.fromViewCenter = fromViewCenter;
    }
    action.toViewCenter = getViewCenter();

	// add to the stack
	undoStack.push(action);
	// trim the back of the stack if it's exceeded the max size
	while (undoStack.length > maxUndoStackSize) {
		undoStack.shift();
	}
	// clear the redo stack
	redoStack = Array();
	// update UI
	updateButtons();
}

function startUndoCombo() {
    undoCombos.push([]);
}

function endUndoCombo() {
    var undoList = undoCombos.pop()
    var action = null;
    if (undoList.length >1) {
        action = new CompositeAction(undoList);

    } else if (undoList.length == 1) {
        action = undoList[0];
    }

    if (action) {
        if (undoCombos.length > 0) {
            undoCombos.push(action);
        } else {
            addUndoAction(action)
        }
    }
}

function endAllUndoCombos() {
    while (undoCombos.length > 0) {
        endUndoCombo();
    }
}

function cancelUndoCombo() {
    var undoList = undoCombos.pop()
    for (var i = undoList.length - 1; i >= 0; i--) {
        undoList[i].undoAction();
    }
}

function cancelAllUndoCombos() {
    while (undoCombos.length > 0) {
        cancelUndoCombo();
    }
}

function resetViewForAction(viewCenter, bounds) {
    if (viewCenter) {
        // if the view hasn't moved then don't try to move it back
        var currentCenter = getViewCenter();
        if (currentCenter.mx == viewCenter.mx
                && currentCenter.my == viewCenter.my
                && currentCenter.scale == viewCenter.scale
                && currentCenter.floor == viewCenter.floor) {
            return;
        }
    }

    if (bounds) {
        centerViewOnBounds(viewCenter, bounds);

    } else if (viewCenter) {
        // ignore scale
        centerViewOnIfNotVisible(viewCenter.mx, viewCenter.my, viewCenter.floor, null);
    }
}

function doUndo() {
	// pop the last action
	var action = undoStack.pop();
	// make sure there was a last action
	if (action) {
	    resetViewForAction(
	        action.fromViewCenter ? action.fromViewCenter : action.toViewCenter,
	        action.fromBounds ? action.fromBounds : action.toBounds);
        // undo the action
        action.undoAction();
        // put it on the redo stack
        redoStack.push(action);

		// update UI
		updateButtons();
	}
}

function doRedo() {
	// pop the next action
	var action = redoStack.pop();
	// make sure is a next action
	if (action) {
	    resetViewForAction(
	        action.toViewCenter ? action.toViewCenter : action.fromViewCenter,
	        action.toBounds ? action.toBounds : action.fromBounds);
        // redo the action
        action.redoAction();
        // put it back on the undo stack
        undoStack.push(action);
		// update UI
		updateButtons();
	}
}

class CompositeAction extends Action {
    constructor(actions) {
        super();
        this.actions = actions;
    }

	undoAction() {
	    for (var a = this.actions.length - 1; a >= 0; a--) {
	        this.actions[a].undoAction();
	    }
	}

	redoAction() {
	    for (var a = 0; a < this.actions.length; a++) {
	        this.actions[a].redoAction();
	    }
	}

	toString() {
		return this.actions.length + " action(s)";
	}
}

//==============================================================
// Undo/Redo actions
//==============================================================

function describeRoomList(rooms) {
    if (!rooms || rooms.length == 0) {
        return "nothing";
    }
    if (rooms.length == 1) {
        return rooms[0].metadata.name;
    }
    return rooms.length + " rooms";
}

class MoveRoomAction extends Action {
	constructor(rooms) {
		super();
		this.rooms = rooms;
		this.recordFrom(this.rooms);
	}
	
	recordFrom() {
	    // record the starting positions for all rooms
	    this.from = [];
	    for (var r = 0; r < this.rooms.length; r++) {
	        this.from.push(new RoomPosition(this.rooms[r]));
	    }
	    // calculate the center point of the starting room positions
	    this.fromBounds = new DojoBounds(this.rooms);
	}

	recordTo() {
	    // record the ending positions for all rooms
	    this.to = [];
	    for (var r = 0; r < this.rooms.length; r++) {
	        this.to.push(new RoomPosition(this.rooms[r]));
	    }
	    // calculate the center point of the ending room positions
	    this.toBounds = new DojoBounds(this.rooms);
	}

	isAMove() {
	    // automatically record the end positions
		this.recordTo(this.rooms);
		// check if any corresponding positions are different
		for (var r = 0; r < this.rooms.length; r++) {
		    if (!this.from[r].equals(this.to[r])) {
		        // found a difference
		        return true;
            }
		}
		// no differences
		return false;
	}

	undoAction() {
        this.action(this.to, this.from);
	}

	redoAction() {
        this.action(this.from, this.to);
	}

	action(from, to) {
	    for (var r = 0; r < this.rooms.length; r++) {
	        var room = this.rooms[r];
            if (from[r].Floor != to[r].Floor) {
                removeFloorRoom(room);
            }
            room.disconnectAllDoors();
            room.setPositionAndConnectDoors(to[r].MX, to[r].MY, to[r].Floor, to[r].R);
            if (from[r].Floor != to[r].Floor) {
                addFloorRoom(room);
            }

            room.updateView();
	    }

        // automatically select the rooms
		selectRooms(this.rooms, false, false);
		saveModelToUrl();
	}

	toString() {
		return "Move " + describeRoomList(this.rooms);
	}
}

class ChangeHueAction extends Action {
	constructor(rooms) {
		super();
		this.rooms = rooms;
		this.recordFrom(this.rooms);
	}

	recordFrom() {
	    // record the starting hues for all rooms
	    this.from = [];
	    for (var r = 0; r < this.rooms.length; r++) {
	        this.from.push(this.rooms[r].hue);
	    }
	    // calculate the center point of the room positions
	    this.fromBounds = new DojoBounds(this.rooms);
		this.toBounds = this.fromBounds;
	}

	recordTo() {
	    // record the ending hues for all rooms
	    this.to = [];
	    for (var r = 0; r < this.rooms.length; r++) {
	        this.to.push(this.rooms[r].hue);
	    }
	}

	isAChange() {
	    // automatically record the end hues
		this.recordTo(this.rooms);
		// check if any corresponding positions are different
		for (var r = 0; r < this.rooms.length; r++) {
		    if (!arrayEquals(this.from[r], this.to[r])) {
		        // found a difference
		        return true;
            }
		}
		// no differences
		return false;
	}

	undoAction() {
        this.action(this.from);
	}

	redoAction() {
        this.action(this.to);
	}

	action(to) {
	    for (var r = 0; r < this.rooms.length; r++) {
	        this.rooms[r].setHue(to[r]);
	    }

		saveModelToUrl();
	}

	toString() {
		return "Change hue on " + describeRoomList(this.rooms);
	}
}

class ChangeLabelAction extends Action {
	constructor(room) {
		super();
		this.room = room;
		this.recordFrom();
	}

	recordFrom() {
	    // record the starting label
	    this.from = this.room.label;
	    this.fromScale = this.room.getLabelScale();
	    // calculate the center point of the room positions
	    this.fromBounds = new DojoBounds([this.room]);
	}

	recordTo() {
	    // record the ending label
	    this.to = this.room.label;
	    this.toScale = this.room.getLabelScale();
	}

	isAChange() {
	    // automatically record the ending label
		this.recordTo();
		// see if the label changed
		return this.from != this.to || this.fromScale != this.toScale;
	}

	undoAction() {
        this.action(this.from, this.fromScale);
	}

	redoAction() {
        this.action(this.to, this.toScale);
	}

	action(to, toScale) {
        this.room.setLabel(to);
        this.room.setLabelScale(toScale);

		saveModelToUrl();
	}

	toString() {
		return "Change label on " + describeRoomList(this.rooms);
	}
}

class AddDeleteRoomsAction extends Action {
	constructor(rooms, add) {
		super();
		this.rooms = rooms;
		// remember the center position
		this.fromBounds = new DojoBounds(rooms);
		this.toBounds = this.fromBounds;
		// remember all the room positions
		this.records = [];
		for (var r = 0; r < this.rooms.length; r++) {
		    this.records.push(new RoomPosition(this.rooms[r]));
		}
		this.add = add;
	}

	undoAction() {
		this.doAction(false);
	}

	redoAction() {
		this.doAction(true);
	}

	doAction(redo) {
		// there's no logical XOR in Javascript?!
		if (!this.add && redo) this.removeAction();
		else if (!this.add && !redo) this.addAction();
		else if (this.add && redo) this.addAction();
		else if (this.add && !redo) this.removeAction();
	}

	addAction() {
	    for (var r = 0; r < this.rooms.length; r++) {
            addRoom(this.rooms[r]);
            // hax to force it to think the floor has changed and setup its display
            this.rooms[r].floor = 100;
            this.rooms[r].setPositionAndConnectDoors(this.records[r].MX, this.records[r].MY, this.records[r].Floor, this.records[r].R);
            // select the rooms
            this.rooms[r].select();
            this.rooms[r].updateView();
	    }
	    // directly set the room selection
        selectedRooms = this.rooms;

		saveModelToUrl();3
	}

	removeAction() {
	    for (var r = 0; r < this.rooms.length; r++) {
            this.rooms[r].deselect();
    	    removeRoom(this.rooms[r]);
    	    // clear selection
            selectedRooms = [];
	    }
	}

	toString() {
		return (this.add ? "Add " : "Delete ") + describeRoomList(this.rooms);
	}
}

class SelectionAction extends Action {
	constructor(oldSelections, newSelections) {
		super();
		// remenber old selection and center
		this.oldSelections = oldSelections;
		this.fromBounds = this.oldSelections && this.oldSelections.length > 0 ?
		    new DojoBounds(this.oldSelections) :
		    null;
		// remenber new selection and center
		this.newSelections = newSelections;
		this.toBounds = this.newSelections && this.newSelections.length > 0 ?
		    new DojoBounds(this.newSelections) :
		    null;
	}

	undoAction() {
		selectRooms(this.oldSelections, false, false);
	}

	redoAction() {
		selectRooms(this.newSelections, false, false);
	}

	toString() {
		return (this.oldSelections ? ("Deselect " + describeRoomList(this.oldSelections)) : "") + ", " +
    		(this.newSelections ? ("Select " + describeRoomList(this.newSelections)) : "");
	}
}

class ChangeSpawnPointAction extends Action {
	constructor(fromRoom, toRoom) {
		super();
		this.from = fromRoom;
		this.to = toRoom;
	}

	undoAction() {
        this.action(this.to, this.from);
	}

	redoAction() {
        this.action(this.from, this.to);
	}

	action(from, to) {
	    if (from) {
    	    from.setSpawnPoint(false);
	    }
	    if (to) {
    	    to.setSpawnPoint(true);
	    }

		saveModelToUrl();
	}

	toString() {
		return "Change spawn point from "
		    + describeRoomList(this.from ? [this.from] : null) + " to "
		    + describeRoomList(this.to ? [this.to] : null);
	}
}
