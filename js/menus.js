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

		// sorting manually in the metadata file itself
//        for (var cat in roomMenuData) {
//            roomMenuData[cat].sort( function(a, b) {
//                return a.name.localeCompare(b.name)
//            } );
//        }
//
//		roomMenuData = sortKeys(roomMenuData);
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
	// only clear debug if it's not explicitly enabled
    if (!debugEnabled) {
        hideDebug();
	}
}

function buildMenu(className = "menu-table") {
    var menuDiv = document.createElement("table");
    menuDiv.className = className;
    return menuDiv;
}

function buildMenuLabel(label, colSpan) {
	var td = document.createElement("td");
	td.className = "label";
	td.innerHTML = label;
	td.colSpan = "" + colSpan;
	return td;
}

function buildBlank(colSpan = 1) {
	var td = document.createElement("td");
	td.colSpan = "" + colSpan;
	return td;
}

function buildMenuHeaderLine(title, colSpan) {
	var tr = document.createElement("tr");
    tr.appendChild(buildBlank());
	tr.appendChild(buildMenuLabel(title, colSpan - 2));
	tr.appendChild(buildCloseMenuButton());
    return tr;
}

function doCloseMenu() {
	clearMenus(this.menuLevel);
}

function buildCloseMenuButton() {
    var buttonDiv = document.createElement("td");
//    buttonDiv.className = "field";
    buttonDiv.innerHTML = `<img class="imgButton" src="icons/icon-close.png" srcset="icons2x/icon-close.png 2x" title="Close Menu"/>`;
    buttonDiv.onclick = doCloseMenu;
    buttonDiv.menuLevel = getCurrentMenuLevel();
    return buttonDiv;
}

function buildMenuButton(label, callback, icon = null, className = "menu-button") {
    var tr = document.createElement("tr");

    var iconTd = document.createElement("td");
	if (icon) {
        iconTd.className = "imgField";
		iconTd.innerHTML = `<img class="imgButton" src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`;
        iconTd.onclick = callback;
        iconTd.menuLevel = getCurrentMenuLevel() + 1;
	}
    tr.appendChild(iconTd);

    var buttonDiv = document.createElement("td");
    buttonDiv.className = className;
    buttonDiv.innerHTML = label;
    buttonDiv.onclick = callback;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;
    tr.appendChild(buttonDiv);

    return tr;
}

function buildLinkMenuButton(label, link, icon = null, error = false) {
    var tr = document.createElement("tr");

	if (icon) {
	    var iconTd = document.createElement("td");
        iconTd.className = "imgField";
		iconTd.innerHTML = `<a class="imgButton" href="${link}"><img src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/></a>`;
        iconTd.menuLevel = getCurrentMenuLevel() + 1;
	    tr.appendChild(iconTd);
	}

    var buttonDiv = document.createElement("td");
    buttonDiv.className = error ? "menu-button-error" : "menu-button";
    buttonDiv.innerHTML = `<a class="link-button" href="${link}">${label}</a>`;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;
    tr.appendChild(buttonDiv);

    return tr;
}

function buildErrorPopup(errors, warns, span = true) {
    var buttonDiv = document.createElement(span ? "span" : "td");
    buttonDiv.className = "menu-button-clear";
    if (errors && errors.length > 0) {
	    buttonDiv.innerHTML = `<img src="icons/icon-error.png" srcset="icons2x/icon-error.png 2x" title="Error"/>`
    } else {
	    buttonDiv.innerHTML = `<img src="icons/icon-warn.png" srcset="icons2x/icon-warn.png 2x" title="Warning"/>`
    }
    buttonDiv.roomMetadata = roomMetadata;
    buttonDiv.errors = errors;
    buttonDiv.warns = warns;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;
    buttonDiv.onclick = doShowErrors;
    return buttonDiv;
}

function buildMenuDivider(colspan) {
    var roomButtonDiv = document.createElement("td");
    roomButtonDiv.className = "menu-divider";
    roomButtonDiv.colSpan = colspan;
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

	if (left < 0) left = 0;

	if (top < 0) top = 0;

    if (left + bcr.width > w) {
        left = Math.max(0, w - bcr.width);
    }
    if (top + bcr.height > h) {
        top = Math.max(0, h - bcr.height);
    }

    menuDiv.style.left = left;
    menuDiv.style.top = top;

    menus.push(menuDiv);

	setTimeout(function() { menuPlacementHack1(menuDiv) }, 100);
}

function menuPlacementHack1(menuDiv) {
	showDebug("HACK " + menuDiv);

    var bcr = menuDiv.getBoundingClientRect();
    // pulled from events.js
//	var windowWidth;
//	var windowHeight;

    if (bcr.right > windowWidth) {
        menuDiv.style.left = "";
        menuDiv.style.right = "0px";
    }

	setTimeout(function() { menuPlacementHack2(menuDiv) }, 100);
}

function menuPlacementHack2(menuDiv) {
	showDebug("HACK " + menuDiv);

    var bcr = menuDiv.getBoundingClientRect();
    // pulled from events.js
//	var windowWidth;
//	var windowHeight;

    if (bcr.bottom > windowHeight) {
        menuDiv.style.top = "";
        menuDiv.style.bottom = "0px";
    }
}

function showMenu(menuDiv, element, fullWidth = false) {
	var elementBcr = element.getBoundingClientRect();
	if (getCurrentMenuLevel() == 0) {
		var left = fullWidth ? 0 : elementBcr.left;
		var top = elementBcr.bottom;

	} else {
		var left = fullWidth ? 0 : elementBcr.right;
		var top = elementBcr.top;
	}

	showMenuAt(menuDiv, left, top);
}

function doBurgerMenu() {
	var element = getMenuTarget();

    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Menu", 3));

    menuDiv.appendChild(buildMenuButton("Save", doSave, "icon-save"));
    menuDiv.appendChild(buildMenuButton("PNG", doPngMenu, "icon-png"));
    menuDiv.appendChild(buildLinkMenuButton("New", "index.html", "icon-new"));
    if (debugEnabled) {
	    menuDiv.appendChild(buildMenuButton("Collision Matrix", doCollisionMatrix));
    }

    showMenu(menuDiv, element);
}

function doAddMenu() {
	var element = getMenuTarget();

    var rmd = getRoomMenuData();
    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Categories", 5));

    for (var cat in rmd) {
        var catButtonDiv = buildMenuButton(cat, doAddCategoryMenu, icon="icon-room-" + rmd[cat][0].image);
        for (var i = 0; i < catButtonDiv.children.length; i++) {
	        catButtonDiv.children[i].category = cat;
	        catButtonDiv.children[i].roomList = rmd[cat];
        }
        menuDiv.appendChild(catButtonDiv);
    }

    if (lastAddedRoomMetadata) {
        menuDiv.appendChild(buildMenuDivider(5));
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

	menuDiv.appendChild(buildMenuHeaderLine(catButton.category, 5));

    for (var r in roomList) {
	    var roomMetadata = roomList[r];
	    var roomButtonDiv = buildAddRoomButton(roomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }
    showMenu(menuDiv, catButton);
}

function hasError(errors, error) {
	if (errors) {
		for (var e = 0; e < errors.length; e++) {
			if (errors[e].search(new RegExp(error, "i")) > -1) {
				return true;
			}
		}
	}
	return false;
}

function buildAddRoomButton(roomMetadata, room = null, errors = null) {
    var roomButtonDiv = buildMenuButton(room != null ? "Duplicate" : roomMetadata.name, doAddRoomButton, icon="icon-room-" + roomMetadata.image);
    for (var i = 0; i < roomButtonDiv.children.length; i++) {
	    roomButtonDiv.children[i].roomMetadata = roomMetadata;
	    roomButtonDiv.children[i].room = room;
    }

    var errors = getNewRoomErrors(roomMetadata);

	var tdenergy = document.createElement("td")
	tdenergy.className = hasError(errors, "energy") ? "field-error" : "field";
    tdenergy.innerHTML = `${roomMetadata.energy}<img src="icons/icon-energy.png" srcset="icons2x/icon-energy.png 2x" title="Energy"/>`;
    roomButtonDiv.appendChild(tdenergy);

	var tdcapacity = document.createElement("td")
	tdcapacity.className = hasError(errors, "capacity") ? "field-error" : "field";
    tdcapacity.innerHTML = `${roomMetadata.capacity}<img src="icons/icon-capacity.png" srcset="icons2x/icon-capacity.png 2x" title="Capacity"/>`;
    roomButtonDiv.appendChild(tdcapacity);

    var warns = getNewRoomWarnings(roomMetadata);
    if (errors || warns) {
		var errorDiv = buildErrorPopup(errors, warns, false);
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
    var baseRoom = roomButton.room

	lastAddedRoomMetadata = roomMetadata;

	doAddRoom(e, roomMetadata, baseRoom);
}

function doRoomMenu(e, room) {
    var e = e || window.event;

    clearMenus();

    var element = room.display;

    var errors = room.getAllErrors();
    var warnings = room.getAllWarnings();

    var menuDiv = buildMenu();

	var tr = document.createElement("tr");

    if (errors || warnings) {
        tr.appendChild(buildErrorPopup(errors, warnings, span = false));
    } else {
        tr.appendChild(buildBlank());
    }
	tr.appendChild(buildMenuLabel(room.metadata.name, 3));
	tr.appendChild(buildCloseMenuButton());

    menuDiv.appendChild(tr);

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom, "icon-rotate-cw"));
    if (room.multifloor) {
	    menuDiv.appendChild(buildMenuButton("Change Floor", rotateFloorSelectedRoom, "icon-change-floor"));
    }

    menuDiv.appendChild(buildAddRoomButton(room.metadata, room));

    menuDiv.appendChild(buildMenuDivider(5));

    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRoom, "icon-delete"));

    showMenuAt(menuDiv, e.clientX, e.clientY);
}

function doShowErrors() {
	var errButton = getMenuTarget();

    var errorList = errButton.errors;
    var warnList = errButton.warns;

    if (errorList && errorList.length > 0) {
	    var menuDiv = buildMenu("menu-table-error");
		menuDiv.appendChild(buildMenuHeaderLine("Errors", 3));
	    for (var e = 0; e < errorList.length; e++) {
		    var error = errorList[e].toString();
		    var errorButton = buildMenuButton(error, null, "icon-error", "menu-button-error");
		    menuDiv.appendChild(errorButton);
	    }

    } else if (warnList && warnList.length > 0) {
	    var menuDiv = buildMenu("menu-table-warn");
		menuDiv.appendChild(buildMenuHeaderLine("Warnings", 3));
	    for (var e = 0; e < warnList.length; e++) {
		    var error = warnList[e].toString();
		    var errorButton = buildMenuButton(error, null, "icon-warn", "menu-button-warn");
		    menuDiv.appendChild(errorButton);
	    }

    } else {
	    var menuDiv = buildMenu();
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
	menuDiv.appendChild(buildMenuHeaderLine("Save URL", 4));

	var url = buildQueryUrl(buildUrlParams());

    // find the pop-up URL text field and set its contents

	// <input id="urlHolder" type="text" size="60" onblur="hideUrlPopup()"/>
	var input = document.createElement("input");
	input.type = "text";
	input.id = "urlCopy";
	input.class = "field";
//	input.size = "30";
	input.style.width = "30ex";
	input.onblur = clearMenus;
    input.value = url;

    var tr = buildMenuButton("Copy", doUrlCopy);

    var td = document.createElement("td");
    td.appendChild(input);
    tr.appendChild(td);
    menuDiv.appendChild(tr);

    showMenu(menuDiv, saveButton, true);

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

function buildMenuInput(label, input, units = null) {
    var tr = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.className = "inputLabel";
    td1.innerHTML = label + ":";
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    td2.appendChild(input);
    tr.appendChild(td2);

    if (units) {
	    var td3 = document.createElement("td");
	    td3.innerHTML = units;
	    tr.appendChild(td3);
    }

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

	menuDiv.appendChild(buildMenuHeaderLine("PNG", 4));

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
    menuDiv.appendChild(buildMenuInput("Scale", scaleInput, "pixels/meter"));

	var sizeDisplay = document.createElement("div");
    sizeDisplay.id = "png-size";
    sizeDisplay.class = "field";
    menuDiv.appendChild(buildMenuInput("Size", sizeDisplay, "pixels"));

    menuDiv.appendChild(buildMenuButton("Create", doPngLinkMenu));

    showMenu(menuDiv, pngButton);
	pngScaleChanged();
}

function doPngLinkMenu() {
	var pngButton = getMenuTarget();

    var e = e || window.event;

    var menuDiv = buildMenu();
	menuDiv.appendChild(buildMenuHeaderLine("Download", 3));

    var pngButton = e.currentTarget;
    var bcr = pngButton.getBoundingClientRect();

    var scaleInput = document.getElementById("png-scale");
	var scale = scaleInput.value;
	var db = scaleInput.dojoBounds;

	if (scale < 1 || scale > 10) {
		return;
	}

	var margin = 32 * scale;

	// Get a list of divs.  These will be populated in the background because canvas.drawImage() is dumb.
	var linkDivs = convertToPngs(db, margin, scale);

	for (var f = db.f1; f <= db.f2; f++) {
	    var td = document.createElement("td");
	    td.appendChild(linkDivs[f]);

	    var tr = document.createElement("tr");
	    tr.appendChild(buildBlank());
	    tr.appendChild(td);
	    menuDiv.appendChild(tr);
	}

    showMenu(menuDiv, pngButton);
}

function doPngClick(e) {
    var e = e || window.event;
    if (e.altKey) {
        // super-secret debug mode: alt-click on an image link to just show it instead of downloading it
        e.preventDefault();

	    var menuDiv = buildMenu();
	    var link = e.currentTarget;
	    var src = link.href;

	    var img = document.createElement("img");
	    img.src = link.href;
	    var td = document.createElement("td");
	    td.appendChild(img);
	    var tr = document.createElement("tr");
	    tr.appendChild(td);
	    menuDiv.appendChild(tr);

	    showMenu(menuDiv, link);
    }
}

var errorRoomList = Array();
var warnRoomList = Array();

function addAllWarning(warning) {
	addAllError(warning, true);
}

function addAllError(error, warn = false) {
	var element = document.getElementById("allErrorsButton");
	var errorList = warn ? element.warnList : element.errorList;
	if (!errorList) {
		errorList = Array();
		if (warn) {
			element.warnList = errorList;

		} else {
			element.errorList = errorList;
		}
	}

	var before = errorList.length;

	if (addToListIfNotPresent(errorList, error) && before == 0) {
		updateErrorIcon(element);
	}
}

function removeAllWarning(warning) {
	removeAllError(warning, true);
}

function removeAllError(error, warn = false) {
	var element = document.getElementById("allErrorsButton");
	var errorList = warn ? element.warnList : element.errorList;
	if (!errorList) {
		errorList = Array();
		if (warn) {
			element.warnList = errorList;

		} else {
			element.errorList = errorList;
		}
	}

	if (removeFromList(errorList, error) && errorList.length == 0) {
		updateErrorIcon(element);
	}
}

function updateErrorIcon(element) {
	if (element.errorList && element.errorList.length > 0) {
		element.innerHTML = `<img src="icons/icon-error.png" srcset="icons2x/icon-error.png 2x" title="Errors"/>`;

	} else if (element.warnList && element.warnList.length > 0) {
		element.innerHTML = `<img src="icons/icon-warn.png" srcset="icons2x/icon-warn.png 2x" title="Warnings"/>`;

	} else {
		element.innerHTML = `<img src="icons/icon-ok.png" srcset="icons2x/icon-ok.png 2x" title="OK"/>`;
	}
}

function doShowAllErrors() {
	var errorButton = getMenuTarget();

	var errors = errorButton.errorList;
	if (errors) {
		errorButton.errors = toErrorStrings(errors);
	} else {
		errorButton.errors = null;
	}

	var warns = errorButton.warnList;
	if (warns) {
		errorButton.warns = toErrorStrings(warns);
	} else {
		errorButton.warns = null;
	}

	doShowErrors()
}

function toErrorStrings(errors) {
	var errorList = Array();
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
	return errorList;
}

function doCollisionMatrix() {
    var e = e || window.event;
    e.preventDefault();

    // super-secret debug mode: enables a menu item that shows a matrix of which rooms can be built immediately
    // above/below which other rooms, and checks that against in-game experimental results

    var menuDiv = buildMenu();
    menuDiv.className = "matrix-table";
    var button = e.currentTarget;

    buildCollisionMatrix(menuDiv);

    showMenu(menuDiv, button);
}