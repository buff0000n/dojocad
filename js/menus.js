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

function getCurrentMenuLevel() {
	return menus.length;
}

function clearMenus(leave = 0) {
    while (getCurrentMenuLevel() > leave) {
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
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;

    var tr = document.createElement("tr");
    tr.appendChild(buttonDiv);

    return tr;
}

function buildLinkMenuButton(label, link, error = false) {
    var buttonDiv = document.createElement("td");
    buttonDiv.className = error ? "menu-button-error" : "menu-button";
    buttonDiv.innerHTML = `<a class="link-button" href="${link}">${label}</a>`;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;

    var tr = document.createElement("tr");
    tr.appendChild(buttonDiv);

    return tr;
}

function buildErrorPopup(errors, span = true) {
    var buttonDiv = document.createElement(span ? "span" : "td");
    buttonDiv.className = "menu-button-clear";
    buttonDiv.innerHTML = `<img src="icons/icon-error.png" srcset="icons2x/icon-error.png 2x" title="Error"/>`
    buttonDiv.roomMetadata = roomMetadata;
    buttonDiv.errors = errors;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;
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

function getMenuTarget() {
   var e = window.event;
    e.preventDefault();
    var element = e.currentTarget;
    var menuLevel = element.menuLevel ? element.menuLevel : 0;
    clearMenus(menuLevel);
    return element;
}

function showMenuAt(menuDiv, left, top) {
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

function showMenu(menuDiv, element) {
	var elementBcr = element.getBoundingClientRect();
	if (getCurrentMenuLevel() == 0) {
		var left = elementBcr.left;
		var top = elementBcr.bottom;

	} else {
		var left = elementBcr.right;
		var top = elementBcr.top;
	}

	showMenuAt(menuDiv, left, top);
}

function doBurgerMenu() {
	var element = getMenuTarget();

    var menuDiv = buildMenu();

    menuDiv.appendChild(buildMenuButton("Save", doSave));
    menuDiv.appendChild(buildMenuButton("PNG", doPngMenu));
    menuDiv.appendChild(buildLinkMenuButton("New", "index.html"));

    showMenu(menuDiv, element);
}

function doAddMenu() {
	var element = getMenuTarget();

    var rmd = getRoomMenuData();
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

    showMenu(menuDiv, element);
}

function doAddCategoryMenu() {
	var catButton = getMenuTarget();

    var roomList = catButton.roomList;
    var bcr = catButton.getBoundingClientRect();

    var menuDiv = buildMenu();
    for (var r in roomList) {
	    var roomMetadata = roomList[r];
	    var roomButtonDiv = buildAddRoomButton(roomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }
    showMenu(menuDiv, catButton);
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

function doAddRoomButton() {
    var e = window.event;
    e.preventDefault();
    clearMenus();

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

    clearMenus();

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

    showMenuAt(menuDiv, e.clientX, e.clientY);
}

function doShowErrors() {
	var errButton = getMenuTarget();

    var errorList = errButton.errors;
    var roomMetadata = errButton.roomMetadata

    if (errorList && errorList.length > 0) {
	    var menuDiv = buildMenu(true);
	    for (var e = 0; e < errorList.length; e++) {
		    var error = errorList[e].toString();
		    var errorButton = buildMenuButton(error, null, true);
		    menuDiv.appendChild(errorButton);
	    }

    } else {
	    var menuDiv = buildMenu(false);
	    menuDiv.appendChild(buildMenuField("No errors found"));
    }

    showMenu(menuDiv, errButton);
}

function buildMenuField(label) {
    var buttonDiv = document.createElement("td");
    buttonDiv.className = "menu-button-clear";
    buttonDiv.innerHTML = label;

    var tr = document.createElement("tr");
    tr.appendChild(buttonDiv);

    return tr;
}

function doSave() {
	var saveButton = getMenuTarget();

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

    showMenu(menuDiv, saveButton);

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

    input.menuLevel = getCurrentMenuLevel() + 1;

    return tr;
}

function pngScaleChanged() {
    clearMenus(document.getElementById("png-scale").menuLevel);

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

function doPngMenu() {
	var pngButton = getMenuTarget();

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

    showMenu(menuDiv, pngButton);
	pngScaleChanged();
}

function doPngLinkMenu() {
	var pngButton = getMenuTarget();

    var e = e || window.event;
    var embed = e.altKey;

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

    showMenu(menuDiv, pngButton);
}

var errorRoomList = Array();

function addAllError(error) {
	var element = document.getElementById("allErrorsButton");
	var errorList = element.errorList;
	if (!errorList) {
		errorList = Array();
		element.errorList = errorList;
	}

	if (errorList.length == 0) {
		element.innerHTML = `<img src="icons/icon-error.png" srcset="icons2x/icon-error.png 2x" title="Errors"/>`;
	}

	addToListIfNotPresent(errorList, error);
}

function removeAllError(error) {
	var element = document.getElementById("allErrorsButton");
	var errorList = element.errorList;
	if (!errorList) {
		errorList = Array();
		element.errorList = errorList;
	}

	if (removeFromList(errorList, error)) {
		if (errorList.length == 0) {
			element.innerHTML = `<img src="icons/icon-ok.png" srcset="icons2x/icon-ok.png 2x" title="OK"/>`;
		}
	}
}

function doShowAllErrors() {
	var errorButton = getMenuTarget();

	var errors = errorButton.errorList;
	var errorList = Array();

	if (errors) {
		for (var e = 0; e < errors.length; e++) {
			var error = errors[e];
			var room = error.room ? error.room : error;
			if (room.getAllErrors) {
				var roomErrors = room.getAllErrors();
				var roomErrorStrings = Array();
				// for now, just use the error strings and consolidate
				for (var re = 0; re < roomErrors.length; re++) {
					roomErrorStrings.push(roomErrors[re].toString());
				}
				addAllToListIfNotPresent(errorList, roomErrorStrings);
			} else {
				addToListIfNotPresent(errorList, error.toString());
			}
		}
	}

	errorButton.errors = errorList;
	doShowErrors()
}
