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
        // check if the menu had an undo action associated with it
        if (menu.undoAction) {
            // handle the undo action
            if (menu.actionSuccess) {
                if (menu.undoAction.isAChange()) {
                    addUndoAction(menu.undoAction);
                }
            } else {
                menu.undoAction.undoAction();
            }
        	saveModelToUrl();
        }

        // check if the menu had a close callback associated with it
        if (menu.closeCallback) {
            menu.closeCallback();
        }
    }
    // might as well clear all popups
	clearErrors();
	// only clear debug if it's not explicitly enabled
    if (!debugEnabled) {
        hideDebug();
	}
}

function clearLastMenu() {
    if (getCurrentMenuLevel() > 0) {
        clearMenus(getCurrentMenuLevel() - 1);
        return true;

    } else {
        return false;
    }
}

function buildMenu(className = "menu-table") {
    var menuDiv = document.createElement("table");
    menuDiv.className = className;
    return menuDiv;
}

function buildMenuLabel(label, colSpan, suffix=null) {
	var td = document.createElement("td");
	if (suffix == null) {
        td.className = "label";
        td.innerHTML = label;

	} else {
    	var span = document.createElement("span");
        span.className = "label";
        span.innerHTML = label;
        td.appendChild(span);

    	var span2 = document.createElement("span");
        span2.innerHTML = suffix;
        td.appendChild(span2);
	}
	td.colSpan = "" + colSpan;
	return td;
}

function buildBlank(colSpan = 1) {
	var td = document.createElement("td");
	td.colSpan = "" + colSpan;
	return td;
}

function buildIconCell(icon) {
    var iconTd = document.createElement("td");
	if (icon) {
		iconTd.innerHTML = `<img src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`;
	}
	// class="imgButton"
	return iconTd;
}

function buildMenuHeaderLine(title, colSpan, icon = null, className = "menu-button") {
	var tr = document.createElement("tr");
    tr.appendChild(buildIconCell(icon));
	tr.appendChild(buildMenuLabel(title, colSpan - 2));
	tr.appendChild(buildCloseMenuButton());
    return tr;
}

function doCloseMenu() {
	clearMenus(this.menuLevel);
}

function buildCloseMenuButton() {
    var buttonDiv = document.createElement("td");
    // todo: there are some weird cases where the right hand column is wider than
    // the icon for no apparent reason, just right-justify the button so it
    // doesn't look dumb
    buttonDiv.style = "text-align: right";
//    buttonDiv.className = "field";
    buttonDiv.innerHTML = `<img class="imgButton closeMenuButton" src="icons/icon-close.png" srcset="icons2x/icon-close.png 2x" title="Close Menu"/>`;
    buttonDiv.onclick = doCloseMenu;
    buttonDiv.menuLevel = getCurrentMenuLevel();
    return buttonDiv;
}

function buildMenuButtonIcon(icon=null, callback=null) {
    var iconTd = document.createElement("td");
	if (icon) {
        iconTd.className = "imgField";
		iconTd.innerHTML = `<img class="${callback ? "imgButton" : ""}" " src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`;
        iconTd.onclick = callback;
        iconTd.menuLevel = getCurrentMenuLevel() + 1;
	}
	return iconTd;
}

function buildButton(label, callback, className = "menu-button", span=1) {
    var buttonDiv = configureButton(document.createElement("td"), label, callback, className);
    if (span > 1) buttonDiv.colSpan = "" + span;
    return buttonDiv;
}

function configureButton(buttonDiv, label, callback, className) {
    buttonDiv.className = className;
    buttonDiv.innerHTML = label;
    buttonDiv.onclick = callback;
    buttonDiv.menuLevel = getCurrentMenuLevel() + 1;
    return buttonDiv;
}

function buildMenuRow(icon = null, element, callback) {
    var tr = document.createElement("tr");

    tr.appendChild(buildMenuButtonIcon(icon, callback));

    tr.appendChild(element);

    return tr;
}

function buildMenuButton(label, callback, icon = null, className = "menu-button", span=1) {
    return buildMenuRow(icon, buildButton(label, callback, className, span), callback);
}

function buildMenuInfo(label, icon = null, className = "menu-line") {
    var labelDiv = document.createElement("td");
    labelDiv.className = className;
    labelDiv.innerHTML = label;
    return buildMenuRow(icon, labelDiv);
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

// callbacks = [{text, callback}]
function doPopupDialog(title, text, error, ...callbacks) {
	var button = getMenuTarget();

    var menuDiv = buildMenu(error ? "menu-table-error" : "menu-table");

    // width of the menu table is the number of callback buttons
    // + 1 for the left icon, and +1 for the right close button
	menuDiv.appendChild(buildMenuHeaderLine(title, callbacks.length + 2, error ? "icon-error" : null));

    var tr = document.createElement("tr");
    var td = document.createElement("td");
    // span the whole width of the menu table with the popup text
    td.colSpan = callbacks.length + 2;
    td.innerHTML = text;
    td.className = "field";
    tr.appendChild(td);
    menuDiv.appendChild(tr);

    var buttonsTr = document.createElement("tr");
    buttonsTr.appendChild(document.createElement("td"));
    for (var i = 0; i < callbacks.length; i++) {
        buttonsTr.append(buildButton(
            callbacks[i].text,
            callbacks[i].callback ? callbacks[i].callback : clearLastMenu,
            error ? "menu-button-error" : "menu-button"
        ));
    }
    menuDiv.appendChild(buttonsTr);

    showMenu(menuDiv, button);
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
    var bcr = menuDiv.getBoundingClientRect();
    // pulled from events.js
//	var windowWidth;
//	var windowHeight;

    if (bcr.bottom > windowHeight) {
        menuDiv.style.top = "";
        menuDiv.style.bottom = "0px";
    }
}

function getMenuCoordsFromElement(element, fullWidth = false) {
	var elementBcr = element.getBoundingClientRect();
	if (getCurrentMenuLevel() == 0) {
		var left = fullWidth ? 0 : elementBcr.left;
		var top = elementBcr.bottom;

	} else {
		var left = fullWidth ? 0 : elementBcr.right;
		var top = elementBcr.top;
	}
	return [left, top];
}

function showMenu(menuDiv, element, fullWidth = false) {
    var [left, top] = getMenuCoordsFromElement(element, fullWidth)
	showMenuAt(menuDiv, left, top);
}

function doBurgerMenu() {
	var element = getMenuTarget();

    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Menu", 3));

    // need to explicitly pass in the layout for a new dojo now that we can autoload from autosave
    menuDiv.appendChild(buildLinkMenuButton("New", "index.html?v=2,0,0,0&mz=BYRgNADJ0UA", "icon-new"));

    menuDiv.appendChild(buildMenuButton("Local Storage", doStorageMenu, "icon-save"));

    menuDiv.appendChild(buildMenuButton("Share", doShare, "icon-link"));

    menuDiv.appendChild(buildMenuButton("PNG", doPngMenu, "icon-png"));

    menuDiv.appendChild(buildMenuButton("Structure", doStructureMenu, "icon-structure"));

    menuDiv.appendChild(buildMenuButton("Settings", doSettingsMenu, "icon-settings"));

    if (debugEnabled) {
	    menuDiv.appendChild(buildMenuButton("Collision Matrix", doCollisionMatrix));
	    menuDiv.appendChild(buildMenuButton("Color Picker", doGenerateColorPicker));
	    menuDiv.appendChild(buildMenuButton("Saturation Picker", doGenerateSatPicker));
	    menuDiv.appendChild(buildMenuButton("Luminance Picker", doGenerateLumPicker));
    }

    showMenu(menuDiv, element);
}

function doAddMenu() {
	var element = getMenuTarget();

    var rmd = getRoomMenuData();
    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Categories", 6));

    for (var cat in rmd) {
        var catCount = roomCounter.getCategoryCount(cat);
        var title = cat + (catCount > 0 ? (" (" + catCount + ")") : "");
        var catButtonDiv = buildMenuButton(title, doAddCategoryMenu, icon="icon-room-" + rmd[cat][0].image);
        for (var i = 0; i < catButtonDiv.children.length; i++) {
	        catButtonDiv.children[i].category = cat;
	        catButtonDiv.children[i].roomList = rmd[cat];
        }
        menuDiv.appendChild(catButtonDiv);
    }

    if (lastAddedRoomMetadata || copiedRooms) {
        menuDiv.appendChild(buildMenuDivider(6));
        if (copiedRooms) {
            // paste menu, yummy delicious paste
            menuDiv.appendChild(buildAddRoomButton(null, copiedRooms));
        }

        if (lastAddedRoomMetadata) {
            var roomButtonDiv = buildAddRoomButton(lastAddedRoomMetadata);
            menuDiv.appendChild(roomButtonDiv);
        }
    }

    showMenu(menuDiv, element);
}

function doAddCategoryMenu() {
	var catButton = getMenuTarget();

    var roomList = catButton.roomList;
    var bcr = catButton.getBoundingClientRect();

    var menuDiv = buildMenu();

    var catCount = roomCounter.getCategoryCount(catButton.category);
    var menuTitle = catButton.category + (catCount > 0 ? (" (" + catCount + ")") : "");
	menuDiv.appendChild(buildMenuHeaderLine(menuTitle, 6));

    for (var r in roomList) {
	    var roomMetadata = roomList[r];
	    var roomButtonDiv = buildAddRoomButton(roomMetadata);
        menuDiv.appendChild(roomButtonDiv);
    }
    showMenu(menuDiv, catButton);
}

function hasError(errors, error) {
	if (errors) {
	    var re = new RegExp(error, "i");
		for (var e = 0; e < errors.length; e++) {
			if (errors[e].search(re) > -1) {
				return true;
			}
		}
	}
	return false;
}

function buildAddRoomButton(roomMetadata, rooms = null, errors = null) {
    // this menu item is used in four different situations

    // as the paste option under the + menu
    if (rooms && rooms == copiedRooms) {
        var menuTitle = "Paste " + (copiedRooms.length > 1 ? (copiedRooms.length + " Rooms") : copiedRooms[0].metadata.name);

    // as the duplicate option under a single room menu or a multiselect rooms menu
    } else if (rooms) {
        var menuTitle = "Duplicate";

    // as a new room option under the + menu
    } else {
        var count = roomCounter.getRoomCount(roomMetadata);
        var menuTitle = roomMetadata.name + (count > 0 ? (" (" + count + ")") : "");
        if (count == 0 && roomMetadata.xp) {
            menuTitle += ` <img src="icons/icon-xp.png" srcset="icons2x/icon-xp.png 2x" title="Rooms providing Clan XP"/>`;
        }
    }

    // for the new room + option and the duplicate single room option, use the
    // room type's icon
    if (roomMetadata) {
        // callback is for adding a single room
        var roomButtonDiv = buildMenuButton(menuTitle, doAddRoomButton, icon="icon-room-" + (roomMetadata.iconImage ? roomMetadata.iconImage : roomMetadata.image));

    // for the paste option use the paste icon
    } else if (rooms == copiedRooms) {
        // callback is for pasting copied rooms
        var roomButtonDiv = buildMenuButton(menuTitle, pasteCopiedRooms, icon="icon-paste");

    // for the multiselect rooms duplicate option, use the copy icon
    // todo: this looks kind of weird directly above the actual copy option
    } else {
        // callback is for dupicating selected rooms
        var roomButtonDiv = buildMenuButton(menuTitle, duplicateSelectedRooms, icon="icon-copy");
    }

    // for single room + and duplicate
    if (roomMetadata) {
        // add a reference to the metadata to the add button, if we have metadata
        for (var i = 0; i < roomButtonDiv.children.length; i++) {
            roomButtonDiv.children[i].roomMetadata = roomMetadata;
        }
        // pre-get errors and warnings from adding one more of this type of room
        var errors = getNewRoomErrors(roomMetadata);
        var warns = getNewRoomWarnings(roomMetadata);

    // for multi-room duplicate and paste
    } else {
        // this is too big to cram into this function
        var { errors, warns, combinedMetaData } = getErrorsWarningsAndCombinedMetadata(rooms);
        // use the combined metadata for the upcoming energy, capacity, and resource UIs
        roomMetadata = combinedMetaData;
    }

    // show required/provided energy
	var tdenergy = document.createElement("td")
    if (roomMetadata.energy != 0) {
        tdenergy.className = hasError(errors, "energy") ? "field-error" : "field";
        tdenergy.innerHTML = `${roomMetadata.energy}<img src="icons/icon-energy.png" srcset="icons2x/icon-energy.png 2x" title="Energy"/>`;
    }
    roomButtonDiv.appendChild(tdenergy);

    // show required/provided capacity
	var tdcapacity = document.createElement("td")
    if (roomMetadata.capacity != 0) {
        tdcapacity.className = hasError(errors, "capacity") ? "field-error" : "field";
        tdcapacity.innerHTML = `${roomMetadata.capacity}<img src="icons/icon-capacity.png" srcset="icons2x/icon-capacity.png 2x" title="Capacity"/>`;
    }
    roomButtonDiv.appendChild(tdcapacity);

    // show required resources
	var tdresources = document.createElement("td")
	if (roomMetadata.resources.length > 0) {
        tdresources.className = "field clickable";
        tdresources.innerHTML = `<img onclick="showResources()" src="icons/icon-resources.png" srcset="icons2x/icon-resources.png 2x" title="Resources"/>`;
        var resourcesButton = tdresources.firstElementChild
        resourcesButton.menuLevel = getCurrentMenuLevel() + 1;
        resourcesButton.metadata = roomMetadata;
	}
    roomButtonDiv.appendChild(tdresources);

    // error/warning icon, if necessary
    if (errors || warns) {
		var errorDiv = buildErrorPopup(errors, warns, false);
	    roomButtonDiv.appendChild(errorDiv);
    }

    return roomButtonDiv;
}

function doAddRoomButton() {
    // relatively simple for adding a single room
    var e = window.event;
    e.preventDefault();
    clearMenus();

    var roomButton = e.currentTarget;
    var roomMetadata = roomButton.roomMetadata;
    var baseRoom = roomButton.room

	lastAddedRoomMetadata = roomMetadata;

	var newRooms;
	// if we have a base room then clone it, so we get the same rotation, label, and hue
	if (baseRoom) {
	    newRooms = cloneRooms([baseRoom]);
    // otherwise, create a brand new room
	} else {
        newRooms = [new Room(roomMetadata)];
	}

    // start the add rooms process
	doAddRooms(e, newRooms);
}

function doRoomMenu(e, rooms) {
    var e = e || window.event;

    clearMenus();

    var errors = null;
    var warnings = null;

    // append errors and warnings for all rooms
    for (var r = 0; r < rooms.length; r++) {
        var roomErrors = rooms[r].getAllErrors();
        if (roomErrors && roomErrors.length > 0) {
            if (errors == null) {
                errors = [];
            }
            addAllToListIfNotPresent(errors, roomErrors);
        }
        var roomWarnings = rooms[r].getAllWarnings();
        if (roomWarnings && roomWarnings.length > 0) {
            if (warnings == null) {
                warnings = [];
            }
            addAllToListIfNotPresent(warnings, roomWarnings);
        }
    }

    var menuDiv = buildMenu();

	var tr = document.createElement("tr");

    // the options are different depending on whether there are one or multiple rooms selected
    var room = rooms.length == 1 ? rooms[0] : null;

    // optional error icon
    if (errors || warnings) {
        tr.appendChild(buildErrorPopup(errors, warnings, span = false));
    } else {
        tr.appendChild(buildBlank());
    }
    if (room) {
        // if we have a single room then the menu title is the room type plus a count of how many of that
        // type of room are in the dojo
        var roomCount = roomCounter.getRoomCount(room.metadata);
        tr.appendChild(buildMenuLabel(room.metadata.name, 4, roomCount <= 1 ? null : `&nbsp;(${roomCount} built)`));
    } else {
        // if there are multiple rooms then the lable is a count of the number of selected rooms
        tr.appendChild(buildMenuLabel(`${rooms.length} rooms`, 4, null));
    }
    tr.appendChild(buildCloseMenuButton());

    menuDiv.appendChild(tr);
    
    var buttonSpan = 2;
    var buttonClass = "menu-button";

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom, "icon-rotate-cw", buttonClass, buttonSpan));

    if (room && room.multifloor) {
        // change floor options is only available when a single room is selected
        menuDiv.appendChild(buildMenuButton("Change Floor", rotateFloorSelectedRoom, "icon-change-floor", buttonClass, buttonSpan));
    }

    // duplicate option
    menuDiv.appendChild(buildAddRoomButton(room ? room.metadata : null, rooms));

    // copy option
    menuDiv.appendChild(buildMenuButton("Copy", copySelectedRooms, "icon-copy", buttonClass, buttonSpan));

    // cut option
    menuDiv.appendChild(buildMenuButton("Cut", cutSelectedRooms, "icon-cut", buttonClass, buttonSpan));

    // if a single room is selected, structure mode is enabled, and there aren't any loop warnings
    // then there are multiple select options
    if (room && settings.structureChecking && analysisResult.spawn && !analysisResult.loops) {
        // put them on the same line because this menu is getting too big
        var selectDiv = document.createElement("td");
        // select all
        selectDiv.appendChild(configureButton(
            document.createElement("span"), "Select All", selectAllRoomsOfSelectedTypes, buttonClass));
            // select branch
        selectDiv.appendChild(configureButton(
            document.createElement("span"), `<img class="imgButton" src="icons/icon-select-branch.png" srcset="icons2x/icon-select-branch.png 2x"/>&nbsp;Branch`,
            selectBranch, buttonClass));
        // select root
        selectDiv.appendChild(configureButton(
            document.createElement("span"), `<img class="imgButton" src="icons/icon-select-root.png" srcset="icons2x/icon-select-root.png 2x"/>&nbsp;Root`,
            selectRoot, buttonClass, buttonSpan));

        selectDiv.colSpan = 4;

        menuDiv.appendChild(buildMenuRow("icon-multiselect", selectDiv, selectAllRoomsOfSelectedTypes));

    } else {
        // basic select all option
        menuDiv.appendChild(buildMenuButton("Select All", selectAllRoomsOfSelectedTypes, "icon-multiselect", buttonClass, buttonSpan));
    }

    if (room) {
        if (room.isSpawnPoint()) {
            menuDiv.appendChild(buildMenuButton("Remove Spawn Point", unsetSelectedRoomSpawn, "icon-spawn-delete", buttonClass, buttonSpan));

        } else {
            if (room.metadata.spawn) {
                menuDiv.appendChild(buildMenuButton("Set Spawn Point", setSelectedRoomSpawn, "icon-spawn", buttonClass, buttonSpan));
            }
        }
    }

    // divider
    menuDiv.appendChild(buildMenuDivider(6));

    // color option
    menuDiv.appendChild(buildMenuButton("Color", doColorMenu, "icon-color", buttonClass, buttonSpan));

    if (room && settings.showLabels) {
        // label option is only available when a single room is selected, and when labels are being show
        menuDiv.appendChild(buildMenuButton("Label", doLabelMenu, "icon-room-label", buttonClass, buttonSpan));
    }

    // divider
    menuDiv.appendChild(buildMenuDivider(6));

    // delete option
    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRooms, "icon-delete", buttonClass, buttonSpan));

    showMenuAt(menuDiv, e.clientX, e.clientY);
}


function doDoorMenu(e, door) {
    var e = e || window.event;

    clearMenus();

    var menuDiv = buildMenu();
    menuDiv.appendChild(buildMenuHeaderLine(door.looping ? "Looping Door" : door.crossBranch ? "Cross Branch Door" : "Door",
        3, door.looping ? "icon-warn" : door.crossBranch ? "icon-force-cross-branch" : null));

    // show the cross branch option if it's not already a cross branch
    if (!door.forceCrossBranch) {
        menuDiv.appendChild(buildMenuButton("Cross Branch", () => { setDoorForceCrossBranch(door, true)}, "icon-force-cross-branch"));
    }
    // show the reset option if it's already a cross branch
    if (door.forceCrossBranch) {
        menuDiv.appendChild(buildMenuButton("Reset", () => { resetDoor(door)}, "icon-force-cross-branch-reset"));
    }

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
		menuDiv.appendChild(buildMenuHeaderLine("No errors found", 3, "icon-ok"));
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

function doShare() {
	var saveButton = getMenuTarget();

    var menuDiv = buildMenu();
	menuDiv.appendChild(buildMenuHeaderLine("Share URL", 4, "icon-link"));

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

function showResources() {
    var e = e || window.event;
	var resourcesButton = getMenuTarget();

    var metadata = resourcesButton.metadata;
	if (metadata) {
	    resources = resourceCounter.getResourcesForRoomMetadata(resourcesButton.metadata);
	} else {
    	resources = resourceCounter.getTotalResources();
	}

    var menuDiv = buildMenu();

    menuDiv.appendChild(buildMenuHeaderLine((metadata ? ("Resources for " + metadata.name) : "Total Resources"), 4, "icon-resources"));

    if (Object.keys(resources).length == 0) {
        var tr = document.createElement("tr");
        tr.innerHTML = `<td/><td>(not applicable)</td><td/><td/>`
        menuDiv.appendChild(tr);

    } else {
        for (var resourceName in resources) {
            var tr = document.createElement("tr");
            tr.innerHTML = `<td/><td>${resourceName}</td><td>${resources[resourceName]}</td><td/>`

            menuDiv.appendChild(tr);
        }
    }

    showMenuAt(menuDiv, e.clientX, e.clientY);
}

function addEscapeListener(element, enterAction=null) {
    element.onkeydown = () => {
        var e = window.event;
        switch (e.code) {
            case "Escape" :
                // escape close the menu
                clearLastMenu();
                break;
            case "Enter" :
                // run the entrt action, if specified
                if (enterAction) {
                    enterAction();
                }
                break;
        }
    }
}

function doLabelMenu() {
	var button = getMenuTarget();
	// has to be a single selected room
	var room = selectedRooms[0];

	// get the menu coords directly and close the original menu
    var [left, top] = getMenuCoordsFromElement(button)
    clearMenus(0);

    var menuDiv = buildMenu();
    // start a label change action and put it on the menu
    // if this menu is closed without clicking save then the changes will be reverted
    var action = new ChangeLabelAction(room);
    menuDiv.undoAction = action;
    // just go ahead and commit whatever was done regardless of how the menu was closed.  That's what we have undo for.
    menuDiv.actionSuccess = true;
    // title
    menuDiv.appendChild(buildMenuHeaderLine("Label", 3, "icon-room-label"));

    // row for the label editor text area
    var tr = document.createElement("tr");
    tr.append(document.createElement("td"));

    var td = document.createElement("td");
//	td.colSpan = "3";

    // text area for editing the label
    var textArea = document.createElement("textarea");
    textArea.className = "labelEditArea";
    textArea.rows = "3";
    textArea.cols = "32";
    // init the value with the room's current label
    textArea.value = uncleanseLabel(room.label);

    // add to the menu
    td.appendChild(textArea);
    tr.appendChild(td);
    tr.append(document.createElement("td"));
    menuDiv.appendChild(tr);

    // escape will be ignored by the default key event handler because it's
    // in an input element
    addEscapeListener(textArea);

    // key up handler for updating the label on the room in real time
    textArea.onkeyup = () => {
        // update the room label
        // this does its own change checking, so we can call this as much as we want
        room.setLabel(textArea.value);
    }

    var sliderRange = 100;
    var sliderToScale = (val) => { return val ? Math.pow(10, (val/(sliderRange/2))) / 10 : null; };
    var scaleToSlider = (scale) => { return scale ? Math.log10(scale * 10) * (sliderRange/2) : null; };

    // row for the scale slider
    var tr = document.createElement("tr");
    tr.append(buildIconCell("icon-label-scale"));
    var td = document.createElement("td");
    var picker = new ColorPicker("icons/scale-picker.png", sliderRange, scaleToSlider(1.0), 4, (room) => { return scaleToSlider(room.getLabelScale()); });
    td.appendChild(picker.container);
    tr.appendChild(td);
    tr.append(document.createElement("td"));
    menuDiv.appendChild(tr);

    var listener = () => {
        var labelScale = sliderToScale(picker.slider.value);

        // update each room's label size in real time
        for (var r = 0; r < selectedRooms.length; r++) {
            selectedRooms[r].setLabelScale(labelScale);
        }
    }

    picker.setListener(listener);

    // clear option
    menuDiv.appendChild(buildMenuButton("Clear", () => { menuDiv.undoAction = null ; clearSelectedRoomsLabels(action); }, "icon-delete" ));

    // save option
    menuDiv.appendChild(buildMenuButton("Save", () => { menuDiv.undoAction = null ; setSelectedRoomsLabels(textArea.value, action); }, "icon-save"));

    // cancel option
    menuDiv.appendChild(buildMenuButton("Cancel", () => { menuDiv.actionSuccess = false; clearLastMenu(); }, "icon-undo"));

    showMenuAt(menuDiv, left, top);

    // after the menu is shown, automatically put the cursor into the text area
    // and select its contents
    textArea.focus();
    textArea.select();
}

// todo: this doesn't work
//var colorPickerStyle = document.createElement("style");
//colorPickerStyle.type="text/css";
//document.head.appendChild(colorPickerStyle);
//
//function setColorSliderThumbColor(hue, sat) {
//    // goddamn this is ugly
//    colorPickerStyle.textContent = `
//        input[type=range]::-webkit-slider-thumb {
//          background-color: hls(${hue}, ${sat}%, 50%);
//        }
//        input[type=range]::-moz-range-thumb {
//          background-color: hls(${hue}, ${sat}%, 50%);
//        }
//        input[type=range]::-ms-thumb {
//          background-color: hls(${hue}, ${sat}%, 50%);
//        }
//    `;
//}

class ColorPicker {
    constructor(pickerImage, range, defaultVal, snapDistance, getRoomValFunc) {
        this.pickerImage = pickerImage;
        this.range = range;
        this.defaultVal = defaultVal;
        this.snapDistance = snapDistance;
        this.getRoomValFunc = getRoomValFunc;
        this.modified = false;

        this.buildUi();
    }
    
    buildUi() {
        // container for the slider
        // this puts the color picker image in the background, behind the slider
        var div = document.createElement("div");
        div.className="colorPicker";

        if (this.pickerImage) {
            var bg = document.createElement("img");
            bg.className="colorPickerBackground";
            bg.src = this.pickerImage;
            div.appendChild(bg);
        }

        // slider input
        var slider = document.createElement("input");
        slider.className = "colorSlider";
        slider.type = "range";
        // hue goes from 0 to 360
        slider.min = "0";
        slider.max = this.range;
        // fit the slider as closely as possible into the background color picker image
        slider.style.width ="256px";
        slider.style.padding = "0";
    
        // escape will be ignored by the default key event handler because it's
        // in an input element
        addEscapeListener(slider);
    
        // get a list of the values currently in use
        var snapVals = [];
        for (var r = 0; r < roomList.length; r++) {
            if (this.getRoomValFunc(roomList[r]) != null) {
                addToListIfNotPresent(snapVals, this.getRoomValFunc(roomList[r]));
            }
        }

        // add preset markers
        for (var h = 0; h < snapVals.length; h++) {
            var hueDiv = document.createElement("div");
            hueDiv.className = "colorPickerPreset";
            // have to tweak the horizontal position to account for the slider's width
            hueDiv.style = `
                left: ${6 + ((snapVals[h] * (240/this.range)))}px;
                top: 0px;
                width: 0px;
                height: 3px;
            `;
            div.appendChild(hueDiv);
        }
    
        // meh, just pick the first room in the selection list to initialize the value
        if (this.getRoomValFunc(selectedRooms[0]) != null) {
            slider.value = this.getRoomValFunc(selectedRooms[0]);
            // todo: this doesn't work
            // setColorSliderThumbColor(slider.value, 50);
        } else {
            // if there's no value to start with, start with red
            slider.value = this.defaultVal;
            // todo: this doesn't work
            // setColorSliderThumbColor(0, 0);
        }
    
        // event handler for changes to the slider
        function onChange() {
            // get the value
            var hue = parseInt(slider.value);
            if (!snapDisabled) {
                // find the nearest existing hue
                var snapHue = null;
                var distance = this.range;
                for (var c = 0; c < snapVals.length; c++) {
                    var d = Math.abs(hue - snapVals[c]);
                    if (d < distance) {
                        snapHue = snapVals[c];
                        distance = d;
                    }
                }
                // if the nearest hue is under the snap distance then snap to that hue
                if (distance <= this.snapDistance) {
                    hue = snapHue;
                    slider.value = snapHue;
                }
            }
            this.modified = true;
            this.listener();
        }
        // register the listener for both change and input values, not sure change is necessary
        slider.addEventListener("change", onChange);
        slider.addEventListener("input", onChange);
        slider.range = this.range;
        slider.snapDistance = this.snapDistance;

        // assemb the div and put it into the table
        div.appendChild(slider);

        this.container = div;
        this.slider = slider;
        this.bg = bg;
    }

    setListener(listener) {
        this.slider.listener = listener;
    }
}

function doColorMenu() {
	var button = getMenuTarget();

	// get the menu coords directly and close the original menu
    var [left, top] = getMenuCoordsFromElement(button)
    clearMenus(0);

    var menuDiv = buildMenu();
    var action = new ChangeHueAction(selectedRooms);
    // start a hue change action and put it on the menu
    // if this menu is closed without clicking save then the changes will be reverted
    menuDiv.undoAction = action;
    // just go ahead and commit whatever was done regardless of how the menu was closed.  That's what we have undo for.
    menuDiv.actionSuccess = true;
    // title
    menuDiv.appendChild(buildMenuHeaderLine("Color", 3, "icon-color-preview-red"));
    // whatevs
    var previewImg = menuDiv.firstChild.firstChild.firstChild;

    function addSlider(icon, barImage, range, defaultVal, snapDistance, getRoomValFunc) {
        // row for the hue slider
        var tr = document.createElement("tr");
        tr.append(buildIconCell(icon));
        var td = document.createElement("td");
        var picker = new ColorPicker(barImage, range, defaultVal, snapDistance, getRoomValFunc);
        td.appendChild(picker.container);
        tr.appendChild(td);
        tr.append(document.createElement("td"));
        menuDiv.appendChild(tr);
        return picker;
    }

    var huePicker = addSlider("icon-color", "icons/color-picker.png", 360, 0, 10,
        (room) => {
            return room.hue == null ? null : room.hue[0];
        }
    );

    var satPicker = addSlider("icon-sat", "icons/sat-picker.png", 200, 50, 5,
        (room) => {
            return room.hue == null ? null : room.hue[1];
        }
    );

    var lumPicker = addSlider("icon-lum", "icons/lum-picker.png", 200, 100, 5,
        (room) => {
            return room.hue == null ? null : room.hue[2];
        }
    );

    var updatePickers = () => {
        var hue = [huePicker.slider.value,
                   satPicker.slider.value,
                   lumPicker.slider.value];

        var hueFilter = "hue-rotate(" + hue[0] + "deg)";
        var hueFilter2 = "hue-rotate(" + (hue[0] - 120) + "deg)";
        var satFilter = "saturate(" + hue[1] + "%)";
        var lumFilter = "brightness(" + hue[2]+ "%)";

        huePicker.bg.style.filter = satFilter + " " + lumFilter;
        satPicker.bg.style.filter = hueFilter2 + " " + lumFilter;
        lumPicker.bg.style.filter = hueFilter2 + " " + satFilter;
        previewImg.style.filter = getDisplayImageFilter(hue);
    }

    var coordinatorListener = () => {
        updatePickers();
        var hue = [huePicker.slider.value,
                   satPicker.slider.value,
                   lumPicker.slider.value];

        // todo: this doesn't work
        // setColorSliderThumbColor(hue, 50);
        // update each room's hue in real time
        for (var r = 0; r < selectedRooms.length; r++) {
            // if the room already has a color set, then only override the parts where the slider has been touched
            selectedRooms[r].setHue(hue, [
                huePicker.slider.modified,
                satPicker.slider.modified,
                lumPicker.slider.modified
            ]);
        }
    }

    huePicker.setListener(coordinatorListener);
    satPicker.setListener(coordinatorListener);
    lumPicker.setListener(coordinatorListener);

    updatePickers();

    // clear option
    menuDiv.appendChild(buildMenuButton("Clear", () => { menuDiv.undoAction = null; clearSelectedRoomsColor(action); }, "icon-delete" ));

    // save option
    menuDiv.appendChild(buildMenuButton("Save", () => {
        menuDiv.undoAction = null;
        setSelectedRoomsColor([
                huePicker.slider.value,
                satPicker.slider.value,
                lumPicker.slider.value
            ], action, [
               huePicker.slider.modified,
               satPicker.slider.modified,
               lumPicker.slider.modified
            ]);
    }, "icon-save"));

    // cancel option
    menuDiv.appendChild(buildMenuButton("Cancel", () => { menuDiv.actionSuccess = false; clearLastMenu(); }, "icon-undo"));

    // "select all" menu line is very custom
    {
        var tr = document.createElement("tr");
        var icon = "icon-multiselect";

        var iconTd = document.createElement("td");
        iconTd.className = "imgField";
        iconTd.innerHTML = `<img src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`;
        iconTd.menuLevel = getCurrentMenuLevel() + 1;
        tr.appendChild(iconTd);

        var buttonDiv = document.createElement("td");

        function addSelectButton(contents, func) {
            var b0 = document.createElement("span");
            b0.className = "menu-button";
            b0.style.margin = "0px";
            b0.innerHTML = contents;
            b0.onclick = func;
            b0.menuLevel = getCurrentMenuLevel() + 1;
            buttonDiv.appendChild(b0);
        }

        addSelectButton(
            `Select Exact`,
            () => {
                menuDiv.undoAction = null;
                clearLastMenu();
                selectAllRoomsOfColor(selectedRooms);
            });

        icon = "icon-color";
        addSelectButton(
            `<img class="imgButton" src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`,
            () => {
                menuDiv.undoAction = null;
                clearLastMenu();
                selectAllRoomsOfColor(selectedRooms, 0);
            });

        icon = "icon-sat";
        addSelectButton(
            `<img class="imgButton" src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`,
            () => {
                menuDiv.undoAction = null;
                clearLastMenu();
                selectAllRoomsOfColor(selectedRooms, 1);
            });

        icon = "icon-lum";
        addSelectButton(
            `<img class="imgButton" src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`,
            () => {
                menuDiv.undoAction = null;
                clearLastMenu();
                selectAllRoomsOfColor(selectedRooms, 2);
            });

        tr.appendChild(buttonDiv);
        menuDiv.appendChild(tr);
    }

    showMenuAt(menuDiv, left, top);
}

function buildMenuInput(label, input, units = null) {
    var tr = document.createElement("tr");

    // only add a label cell if present
    if (label) {
        var td1 = document.createElement("td");
        td1.className = "inputLabel";
        td1.innerHTML = label + ":";
        tr.appendChild(td1);
    }

    var td2 = document.createElement("td");
    td2.appendChild(input);
    // if there is no label the the input spans both columns
    if (!label) {
        td2.colSpan = 2;
    }
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

	menuDiv.appendChild(buildMenuHeaderLine("PNG", 4, "icon-png"));

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

function buildStorageListingHeader(menuDiv) {
    var tr = document.createElement("tr");

    var iconTd = buildMenuButtonIcon();
    tr.appendChild(iconTd);

    function buildHeaderColumn(name, enabled, asc, onchange) {
        // build the header cell with the right content for sorting and a callback
        var div = document.createElement("td");
        div.innerHTML = name + (enabled ? asc ? "&nbsp;↑" : "&nbsp;↓" : "");
        div.class = "menu-header";
        div.onclick = onchange;
        return div
    }

    // name column header
    tr.appendChild(buildHeaderColumn("Name", storage.isSortByName(), storage.isSortAscending(), () => {
        if (!storage.isSortByName()) {
            storage.setSortByName();
        } else {
            storage.setSortAscending(!storage.isSortAscending());
        }
        rebuildStorageListing(menuDiv);
    }));

    // date column header
    tr.appendChild(buildHeaderColumn("Date", storage.isSortByDate(), storage.isSortAscending(), () => {
        if (!storage.isSortByDate()) {
            storage.setSortByDate();
        } else {
            storage.setSortAscending(!storage.isSortAscending());
        }
        rebuildStorageListing(menuDiv);
    }));

    return tr;
}

function truncateName(name) {
    // limit local storage names to 30 characters
    return name.length > 30 ? (name.substring(0, 47) + "...") : name;
}

function buildStorageListingLine(entry, menuDiv) {
    var tr = document.createElement("tr");

    // we'll need the name a lot
    var name = entry.name;

    // only show the overwrite icon/button if it's not the autosave entry
    if (name == storage.autosaveName) {
        var iconTd = document.createElement("td");

    } else {
        // add an overwrite button with a confirmation popup
        var iconTd = buildMenuButtonIcon("icon-save", () => {
            doPopupDialog("Local Storage", "Overwrite " + truncateName(name) + "?", false,
                // only go through with the save if they click Yes
                { "text": "Yes", "callback": () => { doStorageSave(name); } },
                { "text": "No" }
            );
        });
    }
    tr.appendChild(iconTd);

    // the name column value is an actual link containing the room layout
    var nameDiv = document.createElement("td");
    nameDiv.className = "field";
    nameDiv.innerHTML = `<a href="?${entry.item}">${truncateName(name)}</href>`;
    tr.appendChild(nameDiv);

    // the date column is formatted for the user's locale
    var dateDiv = document.createElement("td");
    dateDiv.className = "field";
    dateDiv.innerHTML = entry.date;
    tr.appendChild(dateDiv);

    // add a delete button with a confirmation popup
    var iconTd = buildMenuButtonIcon("icon-delete", () => {
        doPopupDialog("Local Storage", "Delete " + truncateName(name) + "?", false,
            // only go through with the delete if they click Yes
            { "text": "Yes", "callback": () => {
                storage.removeItem(entry.name);
                // rebuild the listing in place
                clearLastMenu();
                rebuildStorageListing(menuDiv);
            } },
            { "text": "No" }
        );
    });
    tr.appendChild(iconTd);

    return tr;
}

function rebuildStorageListing(menuDiv) {
    // leave the first and last rows, containing the menu bar and add button, and delete the rest
    var children = menuDiv.children;
    while (children.length > 2) {
        children.item(1).remove();
    }

    // insert rows before the add button
    var insertBefore = children.item(1);

    // insert the header line
    menuDiv.insertBefore(buildStorageListingHeader(menuDiv), insertBefore);

    // insert a line for each storage listing
    var listing = storage.getListing();
    for (var l = 0; l < listing.length; l++) {
        menuDiv.insertBefore(buildStorageListingLine(listing[l], menuDiv), insertBefore);
    }
}

function doStorageMenu() {
    // Display the local storage menu on its own instead of as a submenu
    clearMenus();

    var menuDiv = buildMenu();
    // menu bar
    menuDiv.appendChild(buildMenuHeaderLine("Local Storage", 4));
    // add button
    menuDiv.appendChild(buildMenuButton("Add", doStorageAdd, "icon-add"));

    // add the actual storage listing
    rebuildStorageListing(menuDiv);

    // show the local storate menu underneath the top bar
    showMenuAt(menuDiv, 0, 64);
}

function doStorageAdd() {
	var button = getMenuTarget();

    // build a short menu to enter the name
    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Save to Local Storage", 3));

	var input = document.createElement("input");
    input.id = "storage-save-name";
    input.class = "field";
    input.type = "text";
    // max of 30 chars
    input.size = 30;
    input.maxLength = 30;
    // add keyboard listeners for escape to cancel and enter to save
    addEscapeListener(input, doStorageAddSave);
    menuDiv.appendChild(buildMenuInput("Name", input));

    // explicit add button
    menuDiv.appendChild(buildMenuButton("Add", doStorageAddSave));

    showMenu(menuDiv, button);

    // focus and select the contents of the text field
    input.focus();
    input.select();
}

function doStorageAddSave() {
	var button = getMenuTarget();
    var e = e || window.event;

    // get the entered name
    var name = document.getElementById("storage-save-name").value;
    // check for blank
    if (!name || name.length == 0) {
        // only option is cancel
        doPopupDialog("Save", "Enter a name", true,
            { "text": "Okay" },
        );
        return;
    }

    // check for autosave
    if (name == storage.autosaveName) {
        doPopupDialog("Save", "Are you sure?  This will be overwritten if Autosave is enabled", true,
            // we'll allow it
            { "text": "Yes", "callback": () => { doStorageSave(name); } },
            { "text": "No" }
        );
        return;
    }

    // check for existing name
    if (storage.containsItem(name)) {
        doPopupDialog("Save", "Name already exists, overwrite?", true,
            // we'll allow it
            { "text": "Yes", "callback": () => { doStorageSave(name); } },
            { "text": "No" }
        );
        return;
    }

    // all checks passed, close the add menu and add the entry
    clearLastMenu();
    doStorageSave(name);
}

function doStorageSave(name) {
    // we need to include the view parameter
    var view = buildViewParam();
    // get the layout parameter
    var layout = buildCompressedModelParam();
    // build a URL snippet and save that directly
    storage.addItem(name, `v=${view}&mz=${layout}`);

    // let's go ahead and rebuild the whole menu because we may need to change the sizing/placement
    // also because I'm not quite sure how many menus deep we are
//    clearLastMenu();
//    rebuildStorageListing();
    doStorageMenu();
}


    function buildCheckbox(name, title, initialValue, callback) {
        // container for the checkbox and label
        var settingDiv = document.createElement("div");
        // checkbox
        var settingInput = document.createElement("input");
        settingInput.id = "input-" + name;
        settingInput.class = "field";
        settingInput.type = "checkbox";
        // set the initial value
        if (initialValue) {
            settingInput.checked = true;
        }
        // register callback
        settingInput.onchange = () => {
            callback(settingInput.checked);
        };
        settingDiv.appendChild(settingInput);

        // label
        var settingSpan = document.createElement("span");
        settingSpan.innerHTML = "&nbsp;" + title;
        settingSpan.className = "field-checkbox-label";
        // register the same callback
        settingSpan.onclick = () => {
            // manually change the checkbox display value
            settingInput.checked = !settingInput.checked;
            // we have to run the callback ourselves, it won't happen automatically
            settingInput.onchange();
        };
        settingDiv.appendChild(settingSpan);

        return buildMenuInput(null, settingDiv);
    }

function doSettingsMenu() {
	var button = getMenuTarget();

    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Settings", 4, "icon-settings"));

    // checkbox settings

    menuDiv.appendChild(buildCheckbox("showAllFloors", "Show All Floors", settings.showAllFloors, (value) => { setShowAllFloors(value); }));

    menuDiv.appendChild(buildCheckbox("showMapMarkers", "Show Map Markers", settings.showMapMarkers, (value) => { setShowMapMarkers(value); }));

    menuDiv.appendChild(buildCheckbox("showLabels", "Show Labels", settings.showLabels, (value) => { setShowLabels(value); }));

    menuDiv.appendChild(buildCheckbox("dimRooms", "Dim Rooms", settings.dimRooms, (value) => { setDimRooms(value); }));

    menuDiv.appendChild(buildCheckbox("rulesEnabled", "Enable Rules", settings.rulesEnabled, (value) => { setRulesEnabled(value); }));

    menuDiv.appendChild(buildMenuDivider(4));

    menuDiv.appendChild(buildCheckbox("autosave", "Autosave", settings.autosave, (value) => { setAutosave(value); }));

    showMenu(menuDiv, button);
}

function doStructureMenu() {
	var button = getMenuTarget();

    var menuDiv = buildMenu();

    // function for enabling/disable parts of teh menu
    // these are the element class names to map when disabling
    var disableMapping = new Map([["imgField", "imgField-disabled"], ["menu-button", "menu-button-disabled"]]);
    // when enabling the mapping is reversed
    var enableMapping = new Map([["imgField-disabled", "imgField"], ["menu-button-disabled", "menu-button"]]);
    // function applies the appropriate class name mapping to all child elemnts in the menu
    function refreshEnabled() {
        if (settings.structureChecking && analysisResult.spawn) {
            replaceClassNames(menuDiv, enableMapping);

        } else {
            replaceClassNames(menuDiv, disableMapping);
        }
    }

	menuDiv.appendChild(buildMenuHeaderLine("Structure", 4, "icon-structure"));

    // the checkbox is not affected by the enable/disable function because
    // it has different class names
    menuDiv.appendChild(buildCheckbox("structureChecking", "Enabled", settings.structureChecking, (value) => {
        setStructureChecking(value);
        refreshEnabled();
    }));

    menuDiv.appendChild(buildMenuDivider(4));

    // show a warning if the spawn point is not present
    if (!analysisResult.spawn) {
        menuDiv.appendChild(buildMenuInfo("Spawn Point Missing", "icon-warn"));

    } else {
        // fins spawn point option
        menuDiv.appendChild(buildMenuButton("Find Spawn Point", selectSpawnRoom, "icon-spawn"));
    }

    // auto-fix option
    menuDiv.appendChild(buildMenuButton("Auto-fix Structure", doAutoSetCrossBranches, "icon-structure-fix"));

    // reset all function
    menuDiv.appendChild(buildMenuButton("Reset All Structure", doResetAllStructure, "icon-force-cross-branch-reset"));

    // set the initial enabled/disabed state of the menu
    refreshEnabled();

    showMenu(menuDiv, button);
}

//////////////////////////////////////////////////////////////////////////
// error/warning menus
//////////////////////////////////////////////////////////////////////////

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

function clearAllErrorsOrWarnings(list, warn=false) {
    if (list) {
        list = list.slice();
        for (var i = 0; i < list.length; i++) {
            // just remove the string warnings, collision warnings are bounds objects
            if (typeof list[i] == "string") {
                removeAllError(list[i], warn);
            }
        }
    }
}

function clearNonCollisionWarnings() {
    var button = document.getElementById("allErrorsButton");
    clearAllErrorsOrWarnings(button.errorList, false);
    clearAllErrorsOrWarnings(button.warnList, true);
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

function doGenerateColorPicker() {
    doGeneratePicker(
        "Color Picker",
        (width, height, name, margin) => { return generateColorPickerPNGLink(width, height, name, margin); },
        "color-picker",
        "icon-color"
    );
}

function doGenerateSatPicker() {
    doGeneratePicker(
        "Saturation Picker",
        (width, height, name, margin) => { return generateSatPickerPNGLink(width, height, name, margin); },
        "sat-picker",
        "icon-sat"
    );
}

function doGenerateLumPicker() {
    doGeneratePicker(
        "Luminance Picker",
        (width, height, name, margin) => { return generateLumPickerPNGLink(width, height, name, margin); },
        "lum-picker",
        "icon-lum"
    );
}

function doGeneratePicker(title, func, img_name_bar, img_name_icon) {
	var button = getMenuTarget();

    var e = e || window.event;

    var menuDiv = buildMenu();
	menuDiv.appendChild(buildMenuHeaderLine(title, 3));

    function generate(width, height, name, margin=0) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var link = func(width, height, name, margin);
        link.onclick = doPngClick;
        td.appendChild(link);
        tr.appendChild(buildBlank());
        tr.appendChild(td);
        menuDiv.appendChild(tr);
    }

    generate(256, 32, img_name_bar, 8);
    generate(64, 32, img_name_icon);
    generate(32, 16, img_name_icon);

    showMenu(menuDiv, button);
}
