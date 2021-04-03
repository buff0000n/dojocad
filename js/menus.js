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
            if (menu.actionSuccessful) {
                if (menu.undoAction.isAChange()) {
                    addUndoAction(menu.undoAction);
                }
            } else {
                menu.undoAction.undoAction();
            }
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

function buildMenuHeaderLine(title, colSpan, icon = null, className = "menu-button") {
	var tr = document.createElement("tr");
    var iconTd = document.createElement("td");
	if (icon) {
		iconTd.innerHTML = `<img class="imgButton" src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x"/>`;
	}
    tr.appendChild(iconTd);
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

    menuDiv.appendChild(buildMenuButton("Save", doSave, "icon-save"));
    menuDiv.appendChild(buildMenuButton("PNG", doPngMenu, "icon-png"));
    menuDiv.appendChild(buildLinkMenuButton("New", "index.html", "icon-new"));
    if (debugEnabled) {
	    menuDiv.appendChild(buildMenuButton("Collision Matrix", doCollisionMatrix));
	    menuDiv.appendChild(buildMenuButton("Color Picker", doGenerateColorPicker));
    }

    showMenu(menuDiv, element);
}

function doAddMenu() {
	var element = getMenuTarget();

    var rmd = getRoomMenuData();
    var menuDiv = buildMenu();

	menuDiv.appendChild(buildMenuHeaderLine("Categories", 6));

    for (var cat in rmd) {
        var catButtonDiv = buildMenuButton(cat, doAddCategoryMenu, icon="icon-room-" + rmd[cat][0].image);
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

	menuDiv.appendChild(buildMenuHeaderLine(catButton.category, 6));

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
    }

    // for the new room + option and the duplicate single room option, use the
    // room type's icon
    if (roomMetadata) {
        // callback is for adding a single room
        var roomButtonDiv = buildMenuButton(menuTitle, doAddRoomButton, icon="icon-room-" + roomMetadata.image);

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
	tdenergy.className = hasError(errors, "energy") ? "field-error" : "field";
    tdenergy.innerHTML = `${roomMetadata.energy}<img src="icons/icon-energy.png" srcset="icons2x/icon-energy.png 2x" title="Energy"/>`;
    roomButtonDiv.appendChild(tdenergy);

    // show required/provided capacity
	var tdcapacity = document.createElement("td")
	tdcapacity.className = hasError(errors, "capacity") ? "field-error" : "field";
    tdcapacity.innerHTML = `${roomMetadata.capacity}<img src="icons/icon-capacity.png" srcset="icons2x/icon-capacity.png 2x" title="Capacity"/>`;
    roomButtonDiv.appendChild(tdcapacity);

    // show required resources
	var tdresources = document.createElement("td")
	tdresources.className = "field clickable";
    tdresources.innerHTML = `<img onclick="showResources()" src="icons/icon-resources.png" srcset="icons2x/icon-resources.png 2x" title="Resources"/>`;
    var resourcesButton = tdresources.firstElementChild
    resourcesButton.menuLevel = getCurrentMenuLevel() + 1;
    resourcesButton.metadata = roomMetadata;
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
            // that's weird way to append one array to another in place
            errors.push.apply(errors, roomErrors);
        }
        var roomWarnings = rooms[r].getAllWarnings();
        if (roomWarnings && roomWarnings.length > 0) {
            if (warnings == null) {
                warnings = [];
            }
            // that's weird way to append one array to another in place
            warnings.push.apply(warnings, roomWarnings);
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

    menuDiv.appendChild(buildMenuButton("Rotate", rotateSelectedRoom, "icon-rotate-cw"));

    if (room && room.multifloor) {
        // change floor options is only available when a single room is selected
        menuDiv.appendChild(buildMenuButton("Change Floor", rotateFloorSelectedRoom, "icon-change-floor"));
    }

    // duplicate option
    menuDiv.appendChild(buildAddRoomButton(room ? room.metadata : null, rooms));

    // copy option
    menuDiv.appendChild(buildMenuButton("Copy", copySelectedRooms, "icon-copy"));

    // cut option
    menuDiv.appendChild(buildMenuButton("Cut", cutSelectedRooms, "icon-cut"));

    // divider
    menuDiv.appendChild(buildMenuDivider(6));

    // color option
    menuDiv.appendChild(buildMenuButton("Color", doColorMenu, "icon-color"));

    if (room) {
        // label option is only available when a single room is selected
        menuDiv.appendChild(buildMenuButton("Label", doLabelMenu, "icon-room-label"));
    }

    // divider
    menuDiv.appendChild(buildMenuDivider(6));

    // delete option
    menuDiv.appendChild(buildMenuButton("Delete", deleteSelectedRooms, "icon-delete"));

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
    menuDiv.actionSuccessful = true;
    // title
    menuDiv.appendChild(buildMenuHeaderLine("Label", 3, menuLevel=0));

    // row for the label editor text area
    var tr = document.createElement("tr");
    var td = document.createElement("td");
	td.colSpan = "3";

    // text area for editing the label
    var textArea = document.createElement("textarea");
    textArea.className = "labelEditArea";
    textArea.rows = "3";
    textArea.cols = "32";
    // init the value with the room's current label
    textArea.value = room.label;

    // add to the menu
    td.appendChild(textArea);
    tr.appendChild(td);
    menuDiv.appendChild(tr);

    // escape will be ignored by the default key event handler because it's
    // in a text area,
    textArea.onkeydown = () => {
        var e = window.event;
        switch (e.code) {
            case "Escape" :
                // escape close the menu
                clearMenus(0);
                break;
        }
    }
    // key up handler for updating the label on the room in real time
    textArea.onkeyup = () => {
        // update the room label
        // this does its own change checking, so we can call this as much as we want
        room.setLabel(textArea.value);
    }

    // save option
    menuDiv.appendChild(buildMenuButton("Save", () => { menuDiv.undoAction = null ; setSelectedRoomsLabels(textArea.value, action); }));

    // clear option
    menuDiv.appendChild(buildMenuButton("Clear", () => { menuDiv.undoAction = null ; clearSelectedRoomsLabels(action); } ));

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

// Ugh this is hacky
var sliderShiftKey = false;

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
    menuDiv.actionSuccessful = true;
    // title
    menuDiv.appendChild(buildMenuHeaderLine("Color", 3, menuLevel=0));

    // row for the hue slider
    var tr = document.createElement("tr");
    var td = document.createElement("td");
	td.colSpan = "3";

    // container for the slider
    // this puts the color picker image in the background, behind the slider
	var div = document.createElement("div");
	div.className="colorPicker";

    // slider input
    var slider = document.createElement("input");
    slider.className = "colorSlider";
    slider.type = "range";
    // hue goes from 0 to 360
    slider.min = "0";
    slider.max = "360";
    // fit the slider as closely as possible into the background color picker image
    slider.style.width ="360px";
    slider.style.padding = "0";

    // get a list of the hues currently in use
    var snapHues = [];
    for (var r = 0; r < roomList.length; r++) {
        if (roomList[r].hue != null) {
            addToListIfNotPresent(snapHues, roomList[r].hue);
        }
    }
    // distance under which we'll snap the slider to an existing hue
    var snapDistance = 10;

    // add preset markers
    for (var h = 0; h < snapHues.length; h++) {
        var hueDiv = document.createElement("div");
        hueDiv.className = "colorPickerPreset";
        // gotta be honest, this is pure guesswork
        hueDiv.style = `
            left: ${(16 + snapHues[h]) * (360/376)}px;
            top: ${(div.boxHeight / 2) - 1}px;
            width: 0px;
            height: 3px;
        `;
        div.appendChild(hueDiv);
    }

    // meh, just pick the first room in the selection list to initialize the value
    if (selectedRooms[0].hue != null) {
        slider.value = selectedRooms[0].hue;
        // todo: this doesn't work
        // setColorSliderThumbColor(slider.value, 50);
    } else {
        // if there's no value to start with, start with red
        slider.value = 0;
        // todo: this doesn't work
        // setColorSliderThumbColor(0, 0);
    }

    // event handler for changes to the slider
    function onChange() {
        // get the value
        var hue = parseInt(slider.value);
        if (!sliderShiftKey) {
            // find the nearest existing hue
            var snapHue = null;
            var distance = 360;
            for (var c = 0; c < snapHues.length; c++) {
                var d = Math.abs(hue - snapHues[c]);
                if (d < distance) {
                    snapHue = snapHues[c];
                    distance = d;
                }
            }
            // if the nearest hue is under the snap distance then snap to that hue
            if (distance <= snapDistance) {
                hue = snapHue;
                slider.value = snapHue;
            }
        }
        // todo: this doesn't work
        // setColorSliderThumbColor(hue, 50);
        // update each room's hue in real time
        for (var r = 0; r < selectedRooms.length; r++) {
            selectedRooms[r].setHue(hue);
        }
    }
    // register the listener for both change and input values, not sure change is necessary
    slider.addEventListener("change", onChange);
    slider.addEventListener("input", onChange);

    // assemb the div and put it into the table
    div.appendChild(slider);
    td.appendChild(div);
    tr.appendChild(td);
    menuDiv.appendChild(tr);

    // save option
    menuDiv.appendChild(buildMenuButton("Save", () => { menuDiv.undoAction = null; setSelectedRoomsColor(slider.value, action); } ));

    // clear option
    menuDiv.appendChild(buildMenuButton("Clear", () => { menuDiv.undoAction = null; clearSelectedRoomsColor(action); } ));

    showMenuAt(menuDiv, left, top);
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

function doGenerateColorPicker() {
	var button = getMenuTarget();

    var e = e || window.event;

    var menuDiv = buildMenu();
	menuDiv.appendChild(buildMenuHeaderLine("Color Picker", 3));

    function generate(width, height, name) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var link = generateColorPickerPNGLink(width, height, name);
        link.onclick = doPngClick;
        td.appendChild(link);
        tr.appendChild(buildBlank());
        tr.appendChild(td);
        menuDiv.appendChild(tr);
    }

    generate(360, 40, "color-picker");
    generate(64, 32, "icon-color");
    generate(32, 16, "icon-color");

    showMenu(menuDiv, button);
}
