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

		if (selectedRoom) {
			selectedRoom.deselect();
		    selectedRoom = null;
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
	if (selectedRoom) {
	    selectedRoom.rotate();
	    selectedRoom.updateView();
		saveModelToUrl();
	}
}

function rotateFloorSelectedRoom() {
	if (selectedRoom) {
	    removeFloorRoom(selectedRoom);
	    selectedRoom.rotateFloor();
	    addFloorRoom(selectedRoom);
	    selectedRoom.updateView();
		saveModelToUrl();
	}
}

function deleteSelectedRoom() {
	if (selectedRoom) {
		var room = selectedRoom;
	    selectedRoom = null;
	    removeRoom(room);
	    clearMenus(0);
		saveModelToUrl();
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
}

function duplicateSelectedRoom(e) {
	if (selectedRoom && !dragged) {
		var room = selectedRoom;
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
	var newScale = scale ? scale : viewScale;
	var newfloor = floor ? floor : viewFloor;
	var cornerPX = (mx * newScale) + (windowWidth / 2);
	var cornerPY = (my * newScale) + (windowHeight/ 2);
	setViewP(cornerPX, cornerPY, newScale, viewFloor);
}

function centerViewOnIfNotVisible(mx, my, floor) {

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
