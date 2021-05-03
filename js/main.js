//==============================================================
// view state
//==============================================================

// Coordinate convention:
//  - mx, my, mv = measured in in-game meters
//  - px, py, pv = measured in pixels

// pixels per meter
var viewScale = 5;
// global view offset
var viewPX = 0;
var viewPY = 0;
var viewFloor = null;

// current image set scaling and background grid image size
var imgScale = 5;
var bg_grid_width = 160;

// max and min zoom levels
var maxViewScale = 60;
var minViewScale = 0.625;
// roughly how many pixels does a mousewheel have to scroll to translate to a 2x zoom in or 0.5x zoom out
var wheel2xZoomScale = 200;
// square of the distance the mouse/touch has to be dragged before drag kicking in
var dragThresholdSquared = 10 * 10;
// actual door snap sensitivity is 2x this
var doorSnapPixels = 25;

// enable the fun stuff
var debugEnabled = false;

function setViewP(newViewPX, newViewPY, newViewScale, newViewFloor = null) {
	var refreshFloor = false;

	clearMenus();

	viewPX = newViewPX;
	viewPY = newViewPY;
	viewScale = newViewScale;
	if (viewFloor == null && newViewFloor == null) {
		newViewFloor = 0;
	}
	if (newViewFloor != null && newViewFloor != viewFloor) {
		viewFloor = newViewFloor;
		refreshFloor = true;
	}

	var grid = document.getElementById("grid");
	grid.style.backgroundPosition = viewPX + "px " + viewPY + "px";
	// We can't just use background-size because it blurs the image for no good reason
	// so we have to know the exact size of bg-grid.png
	var w = (bg_grid_width * viewScale / imgScale);
    grid.style.backgroundSize = w + "px " + w + "px";

	if (refreshFloor) {
	    for (var r = 0; r < roomList.length; r++) {
			roomList[r].removeDisplay();
		}

		setSelectedFloor(viewFloor);

        // clear any selections when we change floors, undoing this will revert
        // the view to the previous floor
		if (selectedRooms.length > 0) {
		    selectRooms([]);
		}
	}

    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];
		if (refreshFloor) {
		    room.addDisplay(getRoomContainer());

	    } else {
	        // We just need to update door bounding boxes when the zoom changes
	        room.updateDoorPositions();
	    }
        room.updateView();
    }

	saveViewToUrl();
}

function redraw() {
	// force an update to all positions and views
	setViewP(viewPX, viewPY, viewScale);
}

function getRoomContainer() {
	return document.getElementById("roomContainer");
}

//==============================================================
// model state
//==============================================================

var roomList = Array();

function getRoomMetadata(id) {
    var rmd = roomMetadata.rooms.find(room => room.id == id);
    if (!rmd) {
        throw "Unknown room id: " + id
    }
    return rmd;
}

function removeRoom(room) {
	removeFromList(roomList, room);
	removeFloorRoom(room);
	room.disconnectAllDoors();
	room.removeCollisions();
	room.removeDisplay();
	room.dispose();
	runRulesOnRoomRemoved(room);
	saveModelToUrl();
}

function addRoom(room) {
	addToListIfNotPresent(roomList, room);
	addFloorRoom(room);
	saveModelToUrl();
	runRulesOnRoomAdded(room);
}

function rotateSelectedRoom() {
    // if we're not currently dragging rooms then start a new move action
    if (!isDraggingRoom()) {
		var action = new MoveRoomAction(selectedRooms);
    }

    // easy case for one selected room
	if (selectedRooms.length == 1) {
	    // just rotate the room around its center
	    selectedRooms[0].rotate();
	    // todo: why do I need this here?
	    selectedRooms[0].updateView();

	} else {
	    // pick a center of rotation
	    var center;
	    if (isDraggingRoom()) {
	        // for rotating while dragging, use the center of the room that was actually clicked and dragged as the
	        // rotation center
	        center = mouseDownTarget.room.mv;

	    } else if (getCurrentMenuLevel > 0 && lastClickedRoom) {
	        // for the rotate menu option, use the center of the room that was actually clicked as the rotation center
	        center = lastClickedRoom.mv;

	    } else {
	        // find the center of bounds, snapped to the nearest 1m
	        center = new DojoBounds(selectedRooms).centerPosition().toVect();
	    }

        for (var r = 0; r < selectedRooms.length; r++) {
            // rotate each room around the center
            selectedRooms[r].rotateAround(center);
            // todo: why do I need this here?
            selectedRooms[r].updateView();
        }
	}

    // if we're not dragging then force the new undo action to store the new
    // room positions by making it check if this qualifies as a move
	if (!isDraggingRoom() && action.isAMove()) {
	    // add the action
        addUndoAction(action);
        saveModelToUrl();
	}
}

function rotateFloorSelectedRoom() {
    // this is only supported when a single room is selected
	if (selectedRooms.length == 1) {
		var action = new MoveRoomAction(selectedRooms);
	    removeFloorRoom(selectedRooms[0]);
	    selectedRooms[0].rotateFloor();
	    addFloorRoom(selectedRooms[0]);
	    selectedRooms[0].updateView();
		saveModelToUrl();
        if (action.isAMove()) {
            addUndoAction(action);
        }
	}
}

function deleteSelectedRooms() {
	if (selectedRooms.length > 0) {
	    // save a copy of the selected room list and reset the selection
	    // not sure if this is necessary, but maybe something weird happens when
	    // deleting a room that's selected
		var oldRooms = selectedRooms;
	    selectedRooms = [];
	    // deselect and remove each room;
        for (var r = 0; r < oldRooms.length; r++) {
            oldRooms[r].deselect();
    	    removeRoom(oldRooms[r]);
        }
	    clearMenus(0);
	    // add an undo action
	    addUndoAction(new AddDeleteRoomsAction(oldRooms, false));
	}
}

function doAddRooms(e, rooms) {
    // loop over the new rooms
    for (var r = 0; r < rooms.length; r++) {
        // todo: use setPosition?
        // get the room's "base" floor
        var floor = rooms[r].floor;
        // hack: if it's a brand new room then the floor will still be 100 from
        // calculating the anchor point
        if (floor == 100) floor = 0;
        // set the floor directly to 100, then go through setFloor to change the floor
        // and initialize all the display elements
        // todo: this is stupid
        rooms[r].floor = 100;
        // offset the base floor with the currently viewed floor
        rooms[r].setFloor(viewFloor + floor);
        // propagate the debug flag
        if (debugEnabled) {
            rooms[r].setDebug(true);
        }
        // add the room to the room list
        addRoom(rooms[r]);
    }

    // not quite sure why this works
    mouseDownTargetStartPX = viewPX;
    mouseDownTargetStartPY = viewPY;

    // start the drag process directly, the rooms will follow the cursor until
    // it is clicked and released
    startNewRoomDrag(e, rooms, rooms[0].display);
	// undo action will be created when the room is dropped
}

function duplicateSelectedRooms(e) {
    // sanity check
	if (!dragged) {
	    // clone the rooms
		var rooms = cloneRooms(selectedRooms);
	    clearMenus(0);

        // add the rooms
	    doAddRooms(e, rooms);
	}
}

function copySelectedRooms() {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // create a position-normalized copy of the rooms and put it in our clipboard
        copiedRooms = cloneRooms(selectedRooms);
    }
}

function cutSelectedRooms() {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // copy + delete
        copySelectedRooms();
        deleteSelectedRooms();
    }
}

function pasteCopiedRooms() {
    if (copiedRooms) {
        clearMenus(0);
        // create a copy of the rooms in the clipboard, not bothering to normalize
        // positions, and start the add process.
        doAddRooms(lastMouseEvent, cloneRooms(copiedRooms, false));
    }
}

function setSelectedRoomsLabels(label, action) {
    if (selectedRooms.length == 1) {
        clearMenus(0);
        // use the room on the existing action
        action.room.setLabel(label);
        // check if it was actually a change
        if (action.isAChange()) {
            // commit the action
            addUndoAction(action);
        	saveModelToUrl();
        }
    }
}

function clearSelectedRoomsLabels(action) {
    // set labe to null
    setSelectedRoomsLabels(null, action);
}

function setSelectedRoomsColor(hue, action) {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // use the room list on the existing action
        for (var r = 0; r < action.rooms.length; r++) {
            action.rooms[r].setHue(hue);
        }
        // check if it was actually a change
        if (action.isAChange()) {
            // commit the action
            addUndoAction(action);
        	saveModelToUrl();
        }
    }
}

function clearSelectedRoomsColor(action) {
    // set the hue to null
    setSelectedRoomsColor(null, action);
}

function movedSelectedRoom() {
	saveModelToUrl();
}

function showDoorMarkers() {
	for (var r = 0; r < roomList.length; r++) {
		roomList[r].showDoorMarkers();
	}
}

function hideDoorMarkers() {
	for (var r = 0; r < roomList.length; r++) {
		roomList[r].hideDoorMarkers();
	}
}

function buildModelParam() {
	var value = "";
	for (var r = 0; r < roomList.length; r++) {
		if (value.length > 0) {
			value += "_";
		}
		value += roomToString(roomList[r]);
	}
	return value;
}

function saveModelToUrl() {
	if (debugEnabled) {
		modifyUrlQueryParam("m", buildModelParam());

	} else {
		modifyUrlQueryParam("mz", LZString.compressToEncodedURIComponent(buildModelParam()));
	}
}

function loadModelFromUrl() {
    var url = window.location.href;
	var modelString = LZString.decompressFromEncodedURIComponent(getQueryParam(url, "mz"));
	if (!modelString) {
		// backwards compatible with the, uh, like maybe couple of dozen old URLs floating around.
		modelString = getQueryParam(url, "m");
		// make things easier and just remove the "m=" section so we can replace it with "mz="
		if (modelString) {
			removeUrlQueryParam("m");
		}
	}
	if (!modelString) {
		return false;
	}

    // parse the model string, accounting for quotes but not removing them
	var roomStrings = quotedSplit(modelString, "_", true);
	for (var rs = 0; rs < roomStrings.length; rs++) {
		var room = roomFromString(roomStrings[rs]);
	    addRoom(room);
	    room.resetPositionAndConnectDoors();
	}
	return true;
}

function buildViewParam() {
	var centerPX = viewPX - (window.innerWidth / 2);
	var centerPY = viewPY - (window.innerHeight / 2);

	var value = Math.ceil(viewScale) + "," + Math.round(centerPX) + "," + Math.round(centerPY) + "," + viewFloor;
	return value;
}

function saveViewToUrl() {
	modifyUrlQueryParam("v", buildViewParam());
}

function loadViewFromUrl() {
    var url = window.location.href;
	var viewString = getQueryParam(url, "v");
	if (!viewString) {
		return false;
	}
	var s = viewString.split(",");
	var scale = parseInt(s[0]);
	var centerPX = parseInt(s[1]);
	var centerPY = parseInt(s[2]);
	var floor = s.length > 3 ? parseInt(s[3]) : 0;

	var cornerPX = centerPX + (window.innerWidth / 2);
	var cornerPY = centerPY + (window.innerHeight/ 2);

	setViewP(cornerPX, cornerPY, scale, floor);
	return true;
}

function buildUrlParams() {
	// this is called from the Save button
	return "?v=" + buildViewParam() + (debugEnabled
		? "&m=" + buildModelParam()
		: "&mz=" + LZString.compressToEncodedURIComponent(buildModelParam()));
}

function centerViewOn(mx, my, scale = null, floor = null) {
	var newScale = scale != null ? scale : viewScale;
	var newfloor = floor != null ? floor : viewFloor;

	// (newPX, newPY) is where the model grid point (0, 0) is
	var newPX = (windowWidth / 2) - (mx * newScale);
	var newPY = (windowHeight / 2) - (my * newScale);
	setViewP(newPX, newPY, newScale, newfloor);
}

function centerViewOnIfNotVisible(mx, my, floor, scale = null) {
	var px = (mx * viewScale) + viewPX;
	var py = (my * viewScale) + viewPY;
	if (floor != viewFloor || px < 0 || px > windowWidth || py < 0 || py > windowWidth) {
		centerViewOn(mx, my, scale, floor);
		return true;

	} else {
		return false;
	}
}

function getViewCenter() {
	var mx = ((windowWidth / 2) - viewPX) / viewScale;
	var my = ((windowHeight / 2) - viewPY) / viewScale;
	var ret = {mx: mx, my: my, floor: viewFloor, scale: viewScale}
	return ret
}

//==============================================================
// Misc
//==============================================================

function setModelDebug(debug) {
    for (var r = 0; r < roomList.length; r++) {
        roomList[r].setDebug(debug);
    }
    redraw();
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
	registerRoomRules(roomMetadata);

    if (loadModelFromUrl()) {
		if (!loadViewFromUrl()) {
			var room = roomList[0];
			if (room) {
		        centerViewOn(room.mv.x, room.mv.y, 5, room.floor);
			} else {
		        centerViewOn(0, 0, 5, 0);
			}
		}

    } else {
        // set the view first so "v=" appears at the beginning of the URL
        centerViewOn(0, 0, 2, 0);
        var starterRoom = new Room(getRoomMetadata("h1"));
        starterRoom.setPosition(0, 0, 0, 0);
        // I smell hax
        starterRoom.placed = true;
	    addRoom(starterRoom);
    }

    redraw();
}
