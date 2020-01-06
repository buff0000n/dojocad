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

function buildMenu(error = false) {
    var menuDiv = document.createElement("table");
    menuDiv.className = error ? "menu-table-error" : "menu-table";
    return menuDiv;
}

function buildMenuButton(label, callback, error = false) {
    var buttonDiv = document.createElement("td");
    buttonDiv.className = error ? "menu-button-error" : "menu-button";
    buttonDiv.innerHTML = label;
    buttonDiv.onclick = callback;

    var tr = document.createElement("tr");
    tr.appendChild(buttonDiv);

    return tr;
}

function buildErrorPopup(errors, span = true, menuLevel = 1) {
    var buttonDiv = document.createElement(span ? "span" : "td");
    buttonDiv.className = "menu-button-error";
    buttonDiv.innerHTML = "!";
    buttonDiv.roomMetadata = roomMetadata;
    buttonDiv.errors = errors;
    buttonDiv.menuLevel = menuLevel;
    buttonDiv.onclick = doShowErrors;
    return buttonDiv;
}

function buildMenuDivider() {
    var roomButtonDiv = document.createElement("td");
    roomButtonDiv.className = "menu-divider";
    var tr = document.createElement("tr");
    tr.appendChild(roomButtonDiv);
    return tr;
}

function doAddMenu(element) {
    var e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var rmd = getRoomMenuData();
    var bcr = element.getBoundingClientRect();
    var menuDiv = buildMenu();

    for (var cat in rmd) {
        var catButtonDiv = buildMenuButton(cat, doAddCategoryMenu);
        catButtonDiv.children[0].roomList = rmd[cat];
        menuDiv.appendChild(catButtonDiv);
    }

    if (lastAddedRoomMetadata) {
        menuDiv.appendChild(buildMenuDivider());
	    var roomButtonDiv = buildAddRoomButton(lastAddedRoomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }

    showMenu(menuDiv, bcr.left, bcr.bottom);
}

function doAddCategoryMenu(e) {
    e = e || window.event;
    e.preventDefault();

    clearMenus(1);

    var catButton = e.currentTarget;
    var roomList = catButton.roomList;
    var bcr = catButton.getBoundingClientRect();

    var menuDiv = buildMenu();
    for (var r in roomList) {
	    var roomMetadata = roomList[r];
	    var roomButtonDiv = buildAddRoomButton(roomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }
    showMenu(menuDiv, bcr.right, bcr.top);
}

function buildAddRoomButton(roomMetadata, room = null, errors = null) {
    var roomButtonDiv = buildMenuButton(room != null ? "Duplicate" : roomMetadata.name, doAddRoomButton);
    roomButtonDiv.children[0].roomMetadata = roomMetadata;
    roomButtonDiv.children[0].room = room;

    var errors = getNewRoomWarnings(roomMetadata);
    if (errors) {
		var errorDiv = buildErrorPopup(errors, false, room ? 1 : 2);
	    roomButtonDiv.appendChild(errorDiv);
    }

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

function doRoomMenu(e, room) {
    var e = e || window.event;

    clearMenus(0);

    var element = room.display;

    var menuDiv = buildMenu();

	var td = document.createElement("tr");
	td.className = "label";
	td.innerHTML = room.metadata.name;

	var tr = document.createElement("tr");
	tr.appendChild(td);

    var errors = room.getAllErrors();
    if (errors) {
        tr.appendChild(buildErrorPopup(errors, span = false, menuLevel = 1));
    }

    menuDiv.appendChild(tr);

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom));
    if (room.multifloor) {
	    menuDiv.appendChild(buildMenuButton("Change Floor", rotateFloorSelectedRoom));
    }

    menuDiv.appendChild(buildAddRoomButton(room.metadata, room));

    menuDiv.appendChild(buildMenuDivider());

    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRoom));

    showMenu(menuDiv, e.clientX, e.clientY);
}

function doShowErrors(e) {
    e = e || window.event;
    e.preventDefault();

    var errButton = e.currentTarget;
    clearMenus(errButton.menuDepth);
    var errorList = errButton.errors;
    var menuLevel = errButton.menuLevel;
    var roomMetadata = errButton.roomMetadata
    var bcr = errButton.getBoundingClientRect();

	clearMenus(menuLevel);

    var menuDiv = buildMenu(true);
    for (var e = 0; e < errorList.length; e++) {
	    var error = errorList[e].toString();
	    var errorButton = buildMenuButton(error, null, true);
	    menuDiv.appendChild(errorButton);
    }

    showMenu(menuDiv, bcr.right, bcr.top);
}

function showMenu(menuDiv, left, top) {
    document.body.appendChild(menuDiv);

    var bcr = menuDiv.getBoundingClientRect();
	var w = window.innerWidth;
	var h = window.innerHeight;

    if (left + bcr.width > w) {
        left = Math.max(0, w - bcr.width);
    }
    if (top + bcr.height > h) {
        top = Math.max(0, h - bcr.height);
    }

    menuDiv.style.left = left;
    menuDiv.style.top = top;

    menus.push(menuDiv);
}