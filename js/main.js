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
var viewFloor = 0;

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
	viewPX = newViewPX;
	viewPY = newViewPY;
	viewScale = newViewScale;

	var grid = document.getElementById("grid");
	grid.style.backgroundPosition = viewPX + "px " + viewPY + "px";
	// We can't just use background-size because it blurs the image for no good reason
	// so we have to know the exact size of bg-grid.png
	var w = (bg_grid_width * viewScale / imgScale);
    grid.style.backgroundSize = w + "px " + w + "px";

	if (newViewFloor) {
		// todo
	}
    for (var r = 0; r < roomList.length; r++) {
        // We just need to update door bounding boxes when the zoom changes
        roomList[r].updateDoorPositions();
        roomList[r].updateView();
    }
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
	room.removeDisplay();
	room.disconnectAllDoors();
	room.removeCollisions();
	saveModelToUrl();
}

function rotateSelectedRoom() {
	if (selectedRoom) {
	    selectedRoom.rotate();
	    selectedRoom.updateView();
		saveModelToUrl();
	}
}

function deleteSelectedRoom() {
	if (selectedRoom) {
	    removeRoom(selectedRoom);
	    selectedRoom = null;
	    clearMenus(0);
		saveModelToUrl();
	}
}

function movedSelectedRoom() {
	saveModelToUrl();
}

function saveModelToUrl() {
	var value = "";
	for (var r = 0; r < roomList.length; r++) {
		if (value.length > 0) {
			value += "_";
		}
		value += roomToString(roomList[r]);
	}
	modifyUrlQueryParam("m", value);
}

function loadModelFromUrl() {
    var url = window.location.href;
	var modelString = getQueryParam(url, "m");
	if (!modelString) {
		return false;
	}

	var roomStrings = modelString.split("_");
	for (var rs = 0; rs < roomStrings.length; rs++) {
		var room = roomFromString(roomStrings[rs]);
	    roomList.push(room);
	    room.addDisplay(getRoomContainer());
	    room.resetPositionAndConnectDoors();
	}
	return true;
}

function saveViewToUrl() {
	var centerPX = viewPX - (window.innerWidth / 2);
	var centerPY = viewPY - (window.innerHeight / 2);

	var value = Math.ceil(viewScale) + "," + Math.round(centerPX) + "," + Math.round(centerPY) + "," + viewFloor;
	modifyUrlQueryParam("v", value);
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
}

function centerViewOn(mx, my, scale = null, floor = null) {
	var newScale = scale ? scale : viewScale;
	var newfloor = floor ? floor : viewFloor;
	var cornerPX = (mx * viewScale) + (window.innerWidth / 2);
	var cornerPY = (my * viewScale) + (window.innerHeight/ 2);
	setViewP(cornerPX, cornerPY, viewScale, viewFloor);
}

//==============================================================
// wrapper for handling both mouse and touch events
//==============================================================

class MTEvent {
	constructor(currentTarget, clientX, clientY, altKey, shiftKey) {
		this.currentTarget = currentTarget;
		this.clientX = clientX;
		this.clientY = clientY;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
	}
}

//==============================================================
// Touch event wrapper layer
//==============================================================

var lastTouchEvent = null;
var lastTouchIdentifier = null;

function touchEventToMTEvent(e) {
//	var show = "touch:";
//    for (var t = 0; t < e.touches.length; t++) {
//        show += " " + e.touches[t].clientY + " (" + e.touches[t].identifier + ")";
//    }
//    showDebug(show);

	// this gets tricky because the first touch in the list may not necessarily be the first touch, and
	// you can end multi-touch with a different touch than the one you started with
	var primary = null;

	if (e.touches.length > 0) {
		// default to the touch identifier we had before
        var identifier = lastTouchIdentifier;
	    if (identifier != -1) {
	        // if we have a previous identifier, then search the touch list for the corresponding touch
	        for (var t = 0; t < e.touches.length; t++) {
		        if (e.touches[t].identifier == identifier) {
		            primary = e.touches[t];
		            break;
		        }
	        }
	    }
	    // if we had no previous touch, or our previous primary touch has disappeared, fall back to the first
	    // touch in the list
	    if (!primary) {
		    primary = e.touches[0];
	    }
	}

    if (primary) {
        // we can generate an event, yay our team
        lastTouchEvent = new MTEvent(primary.target, primary.clientX, primary.clientY, e.altKey, e.shiftKey)
        // save the identifier for next time
        lastTouchIdentifier = primary.identifier;
	    return lastTouchEvent;

    } else if (lastTouchEvent != null) {
        // If a touch ends then we need to look at last event to know where the touch was when it ended
	    return lastTouchEvent;

    } else {
        // probably going to fail
        // todo: remove eventually. I'm pretty sure this can't happen any more
        // Update, it does happen, but I only saw it once and can't replicate it
        showDebug("Generating bogus touch event");
	    return new MTEvent(null, 0, 0, false, false);
    }
}

// zoom state
var touchZooming = false;
// center point of the zoon
var touchZoomCenter = null;
// distance between touches
var touchZoomRadius = 0;
// last distance between touches
var lastTouchZoomRadius = 0;

function calcTouchZoom(e) {
	// calculate the midpoint between the two touches
	var tv1 = new Vect(e.touches[0].clientX, e.touches[0].clientY)
	var tv2 = new Vect(e.touches[1].clientX, e.touches[1].clientY)
	touchZoomCenter = tv1.add(tv2);
	touchZoomCenter.scale(0.5);
	// calculate the distance between the two touches
	touchZoomRadius = tv1.subtract(tv2).length();
}

function touchStart(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
        // just one touch, treat like a mouse down event
	    downEvent(touchEventToMTEvent(e));

    } else if (e.touches.length == 2) {
        // double touch means it's zoom time
        if (!touchZooming) {
            // initialize the zoom state so we have something to compare with when the touches move
            touchZooming = true;
            calcTouchZoom(e);
        }
	}

	// todo: triple-or-more touches are basically ignored, do something with those?
}

function touchMove(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
        // just one touch, treat like a mouse drag
	    dragEvent(touchEventToMTEvent(e));

    } else if (e.touches.length == 2) {
        // double touch means it's zoom time
        if (!touchZooming) {
            // initialize the zoom state so we have something to compare with when the touches move again
            // todo: does initializing here ever actually happen?
            touchZooming = true;
            calcTouchZoom(e);

        } else {
            // save the last zoom radius
            lastTouchZoomRadius = touchZoomRadius;
			// calculate the new zoom center and radius
            calcTouchZoom(e);

			// treat like a mouse/scroll at the midpoint between two zooms and a zoom factor equal to the ratio
			// between the previous and current touch radii
			zoom(touchZoomCenter.x, touchZoomCenter.y, touchZoomRadius/lastTouchZoomRadius);
        }

        // continue dragging with one of the touches, this magically works
        dragEvent(touchEventToMTEvent(e));
    }

	// todo: triple-or-more touches are basically ignored, do something with those?
}

function touchEnd(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 0) {
        // no more touches, stop zooming
        touchZooming = false;
        // treat like a mouse up, touchEventToMTEvent() will need to refer to our last touch event to get the point
        // at which the touch ended
        dropEvent(touchEventToMTEvent(e));
        // clear out any lingering touch state
        lastTouchEvent = null;
        lastTouchIdentifier = -1;

    } else if (e.touches.length == 1) {
        // stop zooming
        touchZooming = false;
        if (mouseDownTarget) {
			// we were dragging a room before
			// leave mouseDownTargetStartPX/Y alone, the currently dragging room will magically either stay on the
			// same touch or transfer to the new touch

        } else {
	        // we were only dragging the view, so simply reset the drag offset.
	        // the new touch will continue the drag, whichever one it is
		    mouseDownTargetStartPX = e.touches[0].clientX;
		    mouseDownTargetStartPY = e.touches[0].clientY;
        }

    } else if (e.touches.length == 2) {
		// todo: triple-or-more touches are basically ignored, do something with those?
		// for now, just reset our zoom state if we were zooming before the triple-touch happened
        if (touchZooming) {
            calcTouchZoom(e);
        }
    }
}

function touchCancel(e) {
    e = e || window.event;
    e.preventDefault();

	cancelRoomDrag();
	touchZooming = false;
}

//==============================================================
// Mouse event wrapper layer
//==============================================================

function mouseEventToMTEvent(e) {
	return new MTEvent(e.currentTarget, e.clientX, e.clientY, e.altKey, e.shiftKey);
}

function mouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    downEvent(mouseEventToMTEvent(e));
}

function contextMenu(e) {
    e = e || window.event;
    e.preventDefault();
    var evt = mouseEventToMTEvent(e);

	// super hack: Treat right-click as selecting a room (click and release), and then clicking again to bring up
	// the menu
    downEvent(evt);
    dropEvent(evt);
    downEvent(evt);
    return false;
}

function mouseMove(e) {
    e = e || window.event;
    e.preventDefault();

    dragEvent(mouseEventToMTEvent(e));
}

function mouseUp(e) {
    e = e || window.event;
    e.preventDefault();

    dropEvent(mouseEventToMTEvent(e));
}

function wheel(e) {
    e = e || window.event;
    e.preventDefault();

	var factor = Math.pow(2, -e.deltaY / wheel2xZoomScale)

    if (debugEnabled) {
        showDebug("Wheel scroll: " + e.deltaY + " => zoom factor " + factor);
    }

	zoom(e.clientX, e.clientY, factor);
	// zooms with mouse wheel are not taken care of by dropEvent()
	// modifyUrlQueryParam() has a delay built in, so we can refresh this as often as we like without the browser
	// yelling at us
	saveViewToUrl();
}

//==============================================================
// Unified event handling
//==============================================================

var mouseDownTarget = null;
var mouseDownTargetStartPX = 0;
var mouseDownTargetStartPY = 0;
var selectedRoom = null;
var dragged = false;
var newRoom = false;

// adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
function downEvent(e) {
	if (mouseDownTarget != null) {
		return;
	}
	
    clearMenus(0);

    // get the mouse cursor position at startup:
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

    if (e.currentTarget.room) {
        mouseDownTarget = e.currentTarget;
        mouseDownTarget.room.setClickPoint(mouseDownTargetStartPX, mouseDownTargetStartPY);
        newRoom = false;
    }

	startDrag();
}

function startNewRoomDrag(e, target) {
	if (selectedRoom) {
		selectedRoom.deselect();
	    selectedRoom.updateView();
	}
    mouseDownTarget = target;
    selectedRoom = target.room;
    selectedRoom.setClickPoint(e.clientX, e.clientY);
    selectedRoom.select();
    newRoom = true;

	startDrag();
	// force the room to start under the cursor
	dragEvent(e);
}

function startDrag() {
    // call a function when the cursor moves:
    document.onmousemove = mouseMove;
    // call a function when the button is released:
    document.onmouseup = mouseUp;

	dragTarget = document;
    // call a function when a touch moves:
    dragTarget.ontouchmove = touchMove;
    // call a function when a touch leaves:
    dragTarget.ontouchend = touchEnd;
}

function dragEvent(e) {
    // calculate the new cursor position:
    var offsetPX = e.clientX - mouseDownTargetStartPX;
    var offsetPY = e.clientY - mouseDownTargetStartPY;

    if (!dragged && ((offsetPX * offsetPX) + (offsetPY * offsetPY) < dragThresholdSquared)) {
        return;
    }

    dragged = true;

    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
	    // set the element's new position:
	    selectedRoom.setDragOffset(offsetPX, offsetPY, e.shiftKey ? 8 : 1);
	    selectedRoom.updateView();

    } else {
		mouseDownTarget = null;
	    mouseDownTargetStartPX = e.clientX;
	    mouseDownTargetStartPY = e.clientY;

		setViewP(viewPX + offsetPX, viewPY + offsetPY, viewScale);
    }
}

function dropEvent(e) {
    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
	    mouseDownTarget = null;
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;

		if (dragged) {
		    selectedRoom.dropDragOffset();
		    selectedRoom.updateView();
		    dragged = false;

		} else if (e.shiftKey) {
			rotateSelectedRoom();

		} else {
			doRoomMenu(e, selectedRoom);
		}

		movedSelectedRoom();

	} else {
		if (!dragged) {
			if (selectedRoom) {
				selectedRoom.deselect();
			    selectedRoom.updateView();
			    selectedRoom = null;
			}
			if (mouseDownTarget && mouseDownTarget.room) {
				selectedRoom = mouseDownTarget.room;
				selectedRoom.select();
			    selectedRoom.updateView();
		    }

		} else {
			saveViewToUrl();
		}

	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    dragged = false;
	}

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    mouseDownTarget = null;
}

function cancelRoomDrag() {
    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
        mouseDownTarget = null;
        mouseDownTargetStartPX = 0;
        mouseDownTargetStartPY = 0;
		if (newRoom) {
			removeRoom(selectedRoom);
		    selectedRoom = null;

		} else {
	        selectedRoom.setDragOffset(0, 0)
		    selectedRoom.dropDragOffset();
		    selectedRoom.updateView();
		}

	    mouseDownTarget = null;
	    dragged = false;

	    document.onmouseup = null;
	    document.onmousemove = null;
	    document.ontouchend = null;
	    document.ontouchmove = null;
    }
}

function zoom(px, py, factor) {
	var mx = (px - viewPX) / viewScale;
	var my = (py - viewPY) / viewScale;

	var newViewScale = viewScale * factor;
	if (newViewScale > maxViewScale) {
		newViewScale = maxViewScale;
	} else if (newViewScale < minViewScale) {
        newViewScale = minViewScale;
    }
	var newViewPX = px - (mx * newViewScale);
	var newViewPY = py - (my * newViewScale);

	if (mouseDownTarget) {
		// Oh god we're dragging and zooming at the same time *sweats profusely*
		mouseDownTargetStartPX = (mouseDownTargetStartPX - viewPX) * (newViewScale / viewScale) + newViewPX;
		mouseDownTargetStartPY = (mouseDownTargetStartPY - viewPY) * (newViewScale / viewScale) + newViewPY;
	}

	setViewP(newViewPX, newViewPY, newViewScale);
}

//==============================================================
// key event handling
//==============================================================

function keyDown(e) {
    e = e || window.event;
    switch (e.code) {
		case "Escape" :
		    clearMenus(0);
		    cancelRoomDrag();
		    break;
		case "Backspace" :
		case "Delete" :
			deleteSelectedRoom();
		    break;
//		case "ArrowUp" :
//			setViewP(viewPX, viewPY, viewScale * 2);
//		    break;
//		case "ArrowDown" :
//			setViewP(viewPX, viewPY, viewScale * 0.5);
//		    break;
	}
}

//==============================================================
// Menu handling
//==============================================================

var lastAdded = null;

var roomMenuData = null;
var menus = Array();
var addRoomMenu = null;
var lastAddedRoomMetadata = null;

function getRoomMenuData() {
    if (!roomMenuData) {
        roomMenuData = Array();
        for (var r = 0; r < roomMetadata.rooms.length; r++) {
            var rmd = roomMetadata.rooms[r];
            var cat = roomMenuData[rmd.category];
            if (!cat) {
                cat = Array();
                roomMenuData[rmd.category] = cat;
            }
            cat.push(rmd);
        }

        for (var cat in roomMenuData) {
            roomMenuData[cat].sort( function(a, b) {
                return a.name.localeCompare(b.name)
            } );
        }

		roomMenuData = sortKeys(roomMenuData);
    }
    return roomMenuData;
}

function clearMenus(leave) {
    while (menus.length > leave) {
        var menu = menus.pop();
        menu.remove();
    }
    // might as well clear all popups
	clearErrors();
}

function buildMenu() {
    var menuDiv = document.createElement("div");
    menuDiv.className = "menu";
    return menuDiv;
}

function buildMenuButton(label, callback) {
    var buttonDiv = document.createElement("div");
    buttonDiv.className = "button";
    buttonDiv.innerHTML = label;
    buttonDiv.onclick = callback;
    return buttonDiv;
}

function buildMenuDivider() {
    var roomButtonDiv = document.createElement("div");
    roomButtonDiv.className = "menuDivider";
    return roomButtonDiv;
}

function doAddMenu(element) {
    var e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var rmd = getRoomMenuData();
    var bcr = element.getBoundingClientRect();
    var menuDiv = buildMenu();
    menuDiv.style.left = bcr.left;
    menuDiv.style.top = bcr.bottom;

    for (var cat in rmd) {
        var catButtonDiv = buildMenuButton(cat, doAddCategoryMenu);
        catButtonDiv.roomList = rmd[cat];
        menuDiv.appendChild(catButtonDiv);
    }

    if (lastAddedRoomMetadata) {
        menuDiv.appendChild(buildMenuDivider());
	    var roomButtonDiv = buildAddRoomButton(lastAddedRoomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }

    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
}

function doAddCategoryMenu(e) {
    e = e || window.event;
    e.preventDefault();

    clearMenus(1);

    var catButton = e.currentTarget;
    var roomList = catButton.roomList;
    var bcr = catButton.getBoundingClientRect();

    var menuDiv = buildMenu();
    menuDiv.style.left = bcr.right;
    menuDiv.style.top = bcr.top;
    for (var r in roomList) {
	    var roomMetadata = roomList[r];
	    var roomButtonDiv = buildAddRoomButton(roomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }
    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
}

function buildAddRoomButton(roomMetadata, room = null) {
    var roomButtonDiv = buildMenuButton(room != null ? "Duplicate" : roomMetadata.name, doAddRoomButton);
    roomButtonDiv.roomMetadata = roomMetadata;
    roomButtonDiv.room = room;
    return roomButtonDiv;
}

function doAddRoomButton(e) {
    e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var roomButton = e.currentTarget;
    var roomMetadata = roomButton.roomMetadata;
    var bcr = roomButton.getBoundingClientRect();

	lastAddedRoomMetadata = roomMetadata;

    var room = new Room(roomMetadata);
    if (roomButton.room) {
        room.rotation = roomButton.room.rotation;
    }
    if (debugEnabled) {
        room.setDebug(true);
    }
    roomList.push(room);
    room.addDisplay(getRoomContainer());

    // not quite sure why this works
    mouseDownTargetStartPX = viewPX;
    mouseDownTargetStartPY = viewPY;

    startNewRoomDrag(e, room.display);
}

function doRoomMenu(e, room) {
    var e = e || window.event;

    clearMenus(0);

    var element = room.display;

    var menuDiv = buildMenu();
    menuDiv.style.left = e.clientX;
    menuDiv.style.top = e.clientY;

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom));

    menuDiv.appendChild(buildAddRoomButton(room.metadata, room));

    menuDiv.appendChild(buildMenuDivider());

    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRoom));

    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
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
	loadViewFromUrl();

    if (!loadModelFromUrl()) {
        var starterRoom = new Room(getRoomMetadata("h1"));
        starterRoom.setPosition(0, 0, 0, 0);
	    roomList.push(starterRoom);
        starterRoom.addDisplay(getRoomContainer());
        centerViewOn(0, 0);
    }

    redraw();
}
