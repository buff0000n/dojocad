// Coordinate convention:
//  - mx, my, mv = measured in in-game meters
//  - px, py, pv = measured in pixels

// View state

// pixels/meters
var viewScale = 5;
// global view offset
var viewPX = 0;
var viewPY = 0;

// Model state

var roomList = Array();

function setViewP(newViewPX, newViewPY) {
	viewPX = newViewPX;
	viewPY = newViewPY;
	document.body.style.backgroundPosition = viewPX + "px " + viewPY + "px";

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].updateView();
    }
}

function removeRoom(room) {
	roomList.splice(roomList.indexOf(room), 1);
	room.removeDisplay();
}

//==============================================================
// Mouse event handling
//==============================================================

var roomDragDelay = 500;

var mouseDownTarget = null;
var mouseDownTargetStartPX = 0;
var mouseDownTargetStartPY = 0;
var roomDragFuture = null;
var roomDragTarget = null;
var dragged = false;

// adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
function mouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    // get the mouse cursor position at startup:
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

    if (!e.currentTarget.room && !e.shiftKey && !e.ctrlKey) {
        startViewDrag();

    } else if (e.currentTarget.room) {
        roomDragTarget = e.currentTarget;
        if (e.shiftKey) {
            roomDragFuture = "shift";
			startRoomDrag();

        } else if (e.altKey) {
            removeRoom(roomDragTarget.room);

        } else {
	        roomDragFuture = setTimeout(startRoomDrag, roomDragDelay);
        }
    }
}

function startRoomDrag(target) {
	if (roomDragFuture != null) {
		roomDragFuture = null;

	    mouseDownTarget = roomDragTarget;
	    roomDragTarget = null;
	    // call a function when the cursor moves:
	    document.onmousemove = dragRoom;
	    // call a function when the button is released:
	    document.onmouseup = endRoomDrag;
	}
}

function dragRoom(e) {
    if (mouseDownTarget && mouseDownTarget.room) {
	    e = e || window.event;
	    e.preventDefault();

	    var room = mouseDownTarget.room;

	    // calculate the new cursor position:
	    var offsetPX = e.clientX - mouseDownTargetStartPX;
	    var offsetPY = e.clientY - mouseDownTargetStartPY;

	    // set the element's new position:
	    room.setViewOffset(offsetPX, offsetPY);
	    room.updateView();
	    dragged = true;
    }
}

function cancelRoomDrag() {
    if (mouseDownTarget && mouseDownTarget.room) {
        var room = mouseDownTarget.room;
        mouseDownTarget = null;
        mouseDownTargetStartPX = 0;
        mouseDownTargetStartPY = 0;
        room.setViewOffset(0, 0)
	    room.updateView();
    }
}

function endRoomDrag(e) {
    if (mouseDownTarget && mouseDownTarget.room) {
	    var room = mouseDownTarget.room;
	    mouseDownTarget = null;
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    room.dropViewOffset();
	    room.updateView();
	    dragged = false;
	}
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}

function startViewDrag() {
    // call a function when the cursor moves:
    document.onmousemove = dragView;
    // call a function when the button is released:
    document.onmouseup = endViewDrag;
}

function dragView(e) {
    if (!mouseDownTarget) {
        // todo: some kind of minimum distance before commiting to dragging the view instead of a room
        if (roomDragFuture) {
            clearTimeout(roomDragFuture);
            roomDragFuture = null;
        }
	    e = e || window.event;
	    e.preventDefault();

	    // calculate the new cursor position:
	    var offsetPX = e.clientX - mouseDownTargetStartPX;
	    var offsetPY = e.clientY - mouseDownTargetStartPY;

	    mouseDownTargetStartPX = e.clientX;
	    mouseDownTargetStartPY = e.clientY;

		setViewP(viewPX + offsetPX, viewPY + offsetPY);
		dragged = true;
    }
}

function endViewDrag(e) {
    if (!mouseDownTarget) {
        if (roomDragFuture) {
            clearTimeout(roomDragFuture);
            roomDragFuture = null;
            if (roomDragTarget && !dragged) {
                // it's a click
                roomDragTarget.room.rotate();
                roomDragTarget.room.updateView();
                roomDragTarget = null;
            }
        }

	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    dragged = false;
	}
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
    var roomViewContainer = document.getElementById("roomContainer");
    roomList.push(new Room(getRoomMetadata("cc"), 64, 64));
    roomList.push(new Room(getRoomMetadata("cb"), 64, 64));
    roomList.push(new Room(getRoomMetadata("cs"), 64, 64));
    roomList.push(new Room(getRoomMetadata("cx"), 64, 64));
    roomList.push(new Room(getRoomMetadata("ct"), 64, 64));

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].addDisplay(roomViewContainer);
    }
}
