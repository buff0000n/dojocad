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

		if (selectedRooms.length > 0) {
		    for (var r = 0; r < selectedRooms.length; r++) {
                selectedRooms[r].deselect();
            }
		    selectedRooms = [];
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
    // todo
	if (selectedRooms.length == 1) {
		var action = new MoveRoomAction(selectedRooms, getViewCenter());
	    selectedRooms[0].rotate();
	    selectedRooms[0].updateView();
		saveModelToUrl();
        if (action.isAMove()) {
            addUndoAction(action);
        }
	}
}

function rotateFloorSelectedRoom() {
	if (selectedRooms.length == 1) {
		var action = new MoveRoomAction(selectedRooms, getViewCenter());
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

function deleteSelectedRoom() {
	if (selectedRooms.length > 0) {
		var oldRooms = selectedRooms;
	    selectedRooms = [];
        for (var r = 0; r < oldRooms.length; r++) {
            oldRooms[r].deselect();
    	    removeRoom(oldRooms[r]);
        }
	    clearMenus(0);
	    addUndoAction(new AddDeleteRoomsAction(oldRooms, false));
	}
}

function doAddRoom(e, roomMetadata, baseRoom) {
    var room = new Room(roomMetadata);
    if (baseRoom) {
        room.rotation = baseRoom.rotation;
    }
    room.setFloor(viewFloor);
    if (debugEnabled) {
        room.setDebug(true);
    }
    addRoom(room);
//    room.addDisplay(getRoomContainer());

    // not quite sure why this works
    mouseDownTargetStartPX = viewPX;
    mouseDownTargetStartPY = viewPY;

    startNewRoomDrag(e, room.display);
	// undo action will be created when the room is dropped
}

function duplicateSelectedRoom(e) {
	if (selectedRooms.length == 1 && !dragged) {
		var room = selectedRooms[0];
	    clearMenus(0);

	    doAddRoom(e, room.metadata, room);
	}
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

	var roomStrings = modelString.split("_");
	for (var rs = 0; rs < roomStrings.length; rs++) {
		var room = roomFromString(roomStrings[rs]);
	    addRoom(room);
//	    room.addDisplay(getRoomContainer());
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
	    addRoom(starterRoom);
    }

    redraw();
}
