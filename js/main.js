// Coordinate convention:
//  - mx, my, mv = measured in in-game meters
//  - px, py, pv = measured in pixels

// View state

// pixels/meters
var viewScale = 5;
// global view offset
var viewPX = 0;
var viewPY = 0;

var imgScale = 5;
var bg_grid_width = 160;

var maxViewScale = 60;
var minViewScale = 0.625;

// Model state

var roomList = Array();

function setViewP(newViewPX, newViewPY, newViewScale) {
	viewPX = newViewPX;
	viewPY = newViewPY;
	viewScale = newViewScale;

	var grid = document.getElementById("grid");
	grid.style.backgroundPosition = viewPX + "px " + viewPY + "px";
	// We can't just use background-size because it blurs the image for no good reason
	// so we have to know the exact size of bg-grid.png
	var w = (bg_grid_width * viewScale / imgScale);
    grid.style.backgroundSize = w + "px " + w + "px";

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].updateView();
    }

    //showDebug("scale: " + newViewScale);
}

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
}

function getRoomContainer() {
	return document.getElementById("roomContainer");
}

function rotateSelectedRoom() {
    selectedRoom.rotate();
    selectedRoom.updateView();
}

function deleteSelectedRoom() {
    removeRoom(selectedRoom);
    selectedRoom = null;
    clearMenus(0);
}


//==============================================================
// Mouse/touch event handling wrapper layer
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

function mouseEventToMTEvent(e) {
	return new MTEvent(e.currentTarget, e.clientX, e.clientY, e.altKey, e.shiftKey);
}

var lastTouchEvent = null;

function touchEventToMTEvent(e) {
    var first = e.touches[0];
    if (first) {
        lastTouchEvent = new MTEvent(first.target, first.clientX, first.clientY, e.altKey, e.shiftKey)
	    return lastTouchEvent;

    } else if (lastTouchEvent != null) {
	    return lastTouchEvent;

    } else {
        // probably going to fail
        // todo: remove eventually
        showDebug("Generating bogus touch event");
	    return new MTEvent(null, 0, 0, false, false);
    }
}

function touchStart(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
	    downEvent(touchEventToMTEvent(e));
    }
}

function touchMove(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
	    dragEvent(touchEventToMTEvent(e));
    }
}

function touchEnd(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 0) {
        dropEvent(touchEventToMTEvent(e));
    }
}

function touchCancel(e) {
    e = e || window.event;
    e.preventDefault();

	cancelRoomDrag();
}

function mouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    downEvent(mouseEventToMTEvent(e));
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

// delta
var wheel2xZoomScale = 200;

function wheel(e) {
    e = e || window.event;
    e.preventDefault();

	var factor = Math.pow(2, -e.deltaY / wheel2xZoomScale)

	zoom(e.clientX, e.clientY, factor);
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

var dragThresholdSquared = 8 * 8;

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
    // call a function when a finger moves:
    dragTarget.ontouchmove = touchMove;
    // call a function when a finger leaves:
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

		} else if (e.altKey) {
			deleteSelectedRoom();

		} else {
			doRoomMenu(e, selectedRoom);
		}

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
		case "ArrowUp" :
			setViewP(viewPX, viewPY, viewScale * 2);
		    break;
		case "ArrowDown" :
			setViewP(viewPX, viewPY, viewScale * 0.5);
		    break;
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

function buildAddRoomButton(roomMetadata, name = null) {
    var roomButtonDiv = buildMenuButton(name != null ? name : roomMetadata.name, doAddRoomButton);
    roomButtonDiv.roomMetadata = roomMetadata;
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

    menuDiv.appendChild(buildAddRoomButton(room.metadata, "Duplicate"));

    menuDiv.appendChild(buildMenuDivider());

    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRoom));

    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
	setViewP(viewPX, viewPY, viewScale);

    roomList.push(new Room(getRoomMetadata("h1"), 64, 64));

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].addDisplay(getRoomContainer());
    }
}
