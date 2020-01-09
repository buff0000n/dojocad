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

function clearMenus(leave = 0) {
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

function buildMenuField(label, ) {
    var buttonDiv = document.createElement("td");
    buttonDiv.className = error ? "menu-button-error" : "menu-button";
    buttonDiv.innerHTML = label;
    buttonDiv.onclick = callback;

    var tr = document.createElement("tr");
    tr.appendChild(buttonDiv);

    return tr;
}

function doSave(element) {
    var e = e || window.event;
    e.preventDefault();

    clearMenus(1);

    var saveButton = e.currentTarget;
    var bcr = saveButton.getBoundingClientRect();

    var menuDiv = buildMenu();

	var url = buildQueryUrl(buildUrlParams());

    // find the pop-up URL text field and set its contents

	// <input id="urlHolder" type="text" size="60" onblur="hideUrlPopup()"/>
	var input = document.createElement("input");
	input.type = "text";
	input.id = "urlCopy";
	input.class = "field";
	input.size = "60";
	input.onblur = clearMenus;
    input.value = url;

    var tr = buildMenuButton("Copy", doUrlCopy);

    var td = document.createElement("td");
    td.appendChild(input);
    tr.appendChild(td);
    menuDiv.appendChild(tr);

    showMenu(menuDiv, bcr.left, bcr.bottom);

    // focus and select the contents of the text field
    input.focus();
    input.select();
}

function doUrlCopy() {
	var element = document.getElementById("urlCopy")

	element.select();
	element.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	document.execCommand("copy");
}

function buildMenuInput(label, input) {
    var tr = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.className = "inputLabel";
    td1.innerHTML = label + ":";
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    td2.appendChild(input);
    tr.appendChild(td2);

    return tr;
}

function pngScaleChanged() {
    clearMenus(1);

    var scaleInput = document.getElementById("png-scale");
	var scale = scaleInput.value;
	var db = scaleInput.dojoBounds;

	var sizeElement = document.getElementById("png-size");
	if (scale < 1 || scale > 10) {
		sizeElement.innerHTML = "Invalid";

	} else {
		sizeElement.innerHTML = ((db.width() + 64) * scale) + " x " + ((db.height() + 64) * scale);
	}
}

function doPngMenu(element) {
    var e = e || window.event;
    e.preventDefault();

    clearMenus(0);

    var pngButton = e.currentTarget;
    var bcr = pngButton.getBoundingClientRect();

    var menuDiv = buildMenu();

    var db = getDojoBounds();

	var scaleInput = document.createElement("input");
    scaleInput.id = "png-scale";
    scaleInput.class = "field";
    scaleInput.type = "number";
    scaleInput.step = 1;
    scaleInput.min = 1;
    scaleInput.max = 10;
    scaleInput.value = 1;
    scaleInput.onchange = pngScaleChanged;
    scaleInput.dojoBounds = db;
    menuDiv.appendChild(buildMenuInput("Scale", scaleInput));

	var sizeDisplay = document.createElement("div");
    sizeDisplay.id = "png-size";
    sizeDisplay.class = "field";
    menuDiv.appendChild(buildMenuInput("Size", sizeDisplay));

    menuDiv.appendChild(buildMenuButton("Create", doPngLinkMenu));

    showMenu(menuDiv, bcr.left, bcr.bottom);
	pngScaleChanged();
}

function doPngLinkMenu(element) {
    var e = e || window.event;
    e.preventDefault();

    var embed = e.altKey;

    clearMenus(1);

    var menuDiv = buildMenu();

    var pngButton = e.currentTarget;
    var bcr = pngButton.getBoundingClientRect();

    var scaleInput = document.getElementById("png-scale");
	var scale = scaleInput.value;
	var db = scaleInput.dojoBounds;

	if (scale < 1 || scale > 10) {
		return;
	}

	var margin = 32 * scale;

	var links = convertToPngs(db, margin, scale);

	for (var f = 0; f < links.length; f++) {
	    var td = document.createElement("td");
	    if (embed) {
	        var img = document.createElement("img");
	        img.src = links[f].href;
		    td.appendChild(img);

	    } else {
		    td.appendChild(links[f]);
	    }

	    var tr = document.createElement("tr");
	    tr.appendChild(td);
	    menuDiv.appendChild(tr);
	}

    showMenu(menuDiv, bcr.left, bcr.bottom);
}