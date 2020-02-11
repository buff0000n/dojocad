class Action {
	prepareUndoAction() {
		return true;
	}

	undoAction() {
		throw "not implemented";
	}

	prepareRedoAction() {
		return true;
	}

	redoAction() {
		throw "not implemented";
	}

	toString() {
		throw "not implemented";
	}
}

class MoveAction extends RoomAction {
	constructor(room, fromX, fromY, fromR, toX, toY, toR) {
		this.room = room;
		this.fromX = fromX;
		this.fromY = fromY;
		this.fromR = fromR;
		this.toX = toX;
		this.toY = toY;
		this.toR = toR;
	}

	prepareUndoAction() {
		return true;
	}

	undoAction() {
		room.disconnectAllDoors();
		room.setPositionAndConnectDoors(this.fromX, this.fromY, room.floor, this.fromR);
	}

	prepareRedoAction() {
		return true;
	}

	redoAction() {
		room.disconnectAllDoors();
		room.setPositionAndConnectDoors(this.toX, this.toY, room.floor, this.toR);
	}

	toString() {
		throw "Move " + room.metadata.name;
	}
}


function doUndo() {
	showDebug("undo");
}

function doRedo() {
	showDebug("redo");
}