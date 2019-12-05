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
	document.getElementById("grid").style.backgroundPosition = viewPX + "px " + viewPY + "px";

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].updateView();
    }
}

function removeRoom(room) {
	removeFromList(roomList, room);
	room.removeDisplay();
}

function getRoomContainer() {
	return document.getElementById("roomContainer");
}

function getRoomMetadata(id) {
    var rmd = roomMetadata.rooms.find(room => room.id == id);
    if (!rmd) {
        throw "Unknown room id: " + id
    }
    return rmd;
}

//==============================================================
// Mouse event handling
//==============================================================

var roomDragDelay = 500;

var mouseDownTarget = null;
var mouseDownTargetStartPX = 0;
var mouseDownTargetStartPY = 0;
var selectedRoom = null;
var dragged = false;

// adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
function mouseDown(e) {
    e = e || window.event;
    e.preventDefault();

	if (mouseDownTarget != null) {
		return;
	}
	
    clearMenus(0);

    // get the mouse cursor position at startup:
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

    if (e.currentTarget.room) {
        mouseDownTarget = e.currentTarget;
    }

    if (selectedRoom && e.currentTarget.room == selectedRoom) {
        startRoomDrag();

    } else {
		startViewDrag();
    }
}

function startRoomDragImmediate(target) {
	if (selectedRoom) {
		selectedRoom.deselect();
	    selectedRoom.updateView();
	}
    mouseDownTarget = target;
    selectedRoom = target.room;
    selectedRoom.select();

	startRoomDrag();
}

function startRoomDrag() {
    // call a function when the cursor moves:
    document.onmousemove = dragRoom;
    // call a function when the button is released:
    document.onmouseup = endRoomDrag;
}

function dragRoom(e) {
    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
	    e = e || window.event;
	    e.preventDefault();

	    // calculate the new cursor position:
	    var offsetPX = e.clientX - mouseDownTargetStartPX;
	    var offsetPY = e.clientY - mouseDownTargetStartPY;

	    // set the element's new position:
	    selectedRoom.setDragOffset(offsetPX, offsetPY, e.shiftKey ? 8 : 1);
	    selectedRoom.updateView();
	    dragged = true;
    }
}

function cancelRoomDrag() {
    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
        mouseDownTarget = null;
        mouseDownTargetStartPX = 0;
        mouseDownTargetStartPY = 0;
        selectedRoom.setDragOffset(0, 0)
	    selectedRoom.updateView();
    }
    mouseDownTarget = null;
}

function endRoomDrag(e) {
    if (mouseDownTarget && mouseDownTarget.room && mouseDownTarget.room == selectedRoom) {
	    e = e || window.event;
	    e.preventDefault();

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
			doRoomMenu(selectedRoom.display);
		}
	}

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    mouseDownTarget = null;
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

function startViewDrag() {
    // call a function when the cursor moves:
    document.onmousemove = dragView;
    // call a function when the button is released:
    document.onmouseup = endViewDrag;
}

function dragView(e) {
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    var offsetPX = e.clientX - mouseDownTargetStartPX;
    var offsetPY = e.clientY - mouseDownTargetStartPY;

	mouseDownTarget = null;
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

	setViewP(viewPX + offsetPX, viewPY + offsetPY);
	dragged = true;
}

function endViewDrag(e) {
	if (!dragged && mouseDownTarget && mouseDownTarget.room) {
		if (selectedRoom) {
			selectedRoom.deselect();
		    selectedRoom.updateView();
		}
		selectedRoom = mouseDownTarget.room;
		selectedRoom.select();
	    selectedRoom.updateView();
	}

    mouseDownTargetStartPX = 0;
    mouseDownTargetStartPY = 0;
    dragged = false;

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    mouseDownTarget = null;
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

function buildAddRoomButton(roomMetadata) {
    var roomButtonDiv = buildMenuButton(roomMetadata.name, doAddRoomButton);
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

    startRoomDragImmediate(room.display);
    dragRoom(e);
}

function doRoomMenu(element) {
    var e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var menuDiv = buildMenu();
    menuDiv.style.left = e.clientX;
    menuDiv.style.top = e.clientY;

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom));

    menuDiv.appendChild(buildMenuDivider());

    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRoom));

    document.body.appendChild(menuDiv);
    menus.push(menuDiv);
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
    roomList.push(new Room(getRoomMetadata("h1"), 64, 64));

    for (var r = 0; r < roomList.length; r++) {
        roomList[r].addDisplay(getRoomContainer());
    }
}
