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
	removeFromList(roomList, room);
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

	if (mouseDownTarget != null) {
		return;

	} else if (!menuBeingClicked) {
	    clearMenus(0);
	}

    // get the mouse cursor position at startup:
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

    if (!e.currentTarget.room && !e.shiftKey && !e.ctrlKey) {
        startViewDrag();

    } else if (e.currentTarget.room) {
        roomDragTarget = e.currentTarget;
        if (e.shiftKey) {
			startRoomDragImmediate(roomDragTarget);

        } else if (e.altKey) {
            removeRoom(roomDragTarget.room);

        } else {
	        roomDragFuture = setTimeout(startRoomDrag, roomDragDelay);
        }
    }
}
function startRoomDragImmediate(target) {
    roomDragTarget = target;
    roomDragFuture = "shift";
	startRoomDrag();
}

function startRoomDrag() {
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
	    room.setDragOffset(offsetPX, offsetPY, e.shiftKey ? 8 : 1);
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
        room.setDragOffset(0, 0)
	    room.updateView();
    }
}

function endRoomDrag(e) {
    if (mouseDownTarget && mouseDownTarget.room) {
	    var room = mouseDownTarget.room;
	    mouseDownTarget = null;
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    room.dropDragOffset();
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
// Menu handling
//==============================================================

var lastAdded = null;

var roomMenuData = null;
var menus = Array();
var addRoomMenu = null;
var lastAddedRoomMetadata = null;

var menuBeingClicked = false;

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
}

function setMenuBeingClicked() {
    menuBeingClicked = true;
}

function doAddButton(element) {
    menuBeingClicked = false;

    var e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var rmd = getRoomMenuData();
    var bcr = element.getBoundingClientRect();
    var menuDiv = document.createElement("div");
    menuDiv.className = "menu";
    menuDiv.style.left = bcr.left;
    menuDiv.style.top = bcr.bottom;

    if (lastAddedRoomMetadata) {
	    var roomButtonDiv = buildAddRoomButton(lastAddedRoomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }

    for (var cat in rmd) {
        var catButtonDiv = document.createElement("div");
        catButtonDiv.className = "button";
        catButtonDiv.innerHTML = cat;
        catButtonDiv.roomList = rmd[cat];
        catButtonDiv.onmousedown = setMenuBeingClicked;
        catButtonDiv.onclick = doAddCategoryButton;
        menuDiv.appendChild(catButtonDiv);
    }
    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
}

function doAddCategoryButton(e) {
    menuBeingClicked = false;

    e = e || window.event;
    e.preventDefault();

    clearMenus(1);

    var catButton = e.currentTarget;
    var roomList = catButton.roomList;
    var bcr = catButton.getBoundingClientRect();

    var menuDiv = document.createElement("div");
    menuDiv.className = "menu";
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

function buildAddRoomButton(roomMetadata) {
    var roomButtonDiv = document.createElement("div");
    roomButtonDiv.className = "button";
    roomButtonDiv.innerHTML = roomMetadata.name;
    roomButtonDiv.roomMetadata = roomMetadata;
    roomButtonDiv.onmousedown = setMenuBeingClicked;
    roomButtonDiv.onclick = doAddRoomButton;
    return roomButtonDiv;
}

function doAddRoomButton(e) {
    menuBeingClicked = false;

    e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var roomButton = e.currentTarget;
    var roomMetadata = roomButton.roomMetadata;
    var bcr = roomButton.getBoundingClientRect();

	lastAddedRoomMetadata = roomMetadata;

    var room = new Room(roomMetadata);
    roomList.push(room);
    room.addDisplay(document.getElementById("roomContainer"));

    // not quite sure why this works
    mouseDownTargetStartPX = viewPX;
    mouseDownTargetStartPY = viewPY;

    startRoomDragImmediate(room.element);
    dragRoom(e);
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
    var roomViewContainer = document.getElementById("roomContainer");
    roomList.push(new Room(getRoomMetadata("h1"), 64, 64));

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].addDisplay(roomViewContainer);
    }
}
