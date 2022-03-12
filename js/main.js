//==============================================================
// view state
//==============================================================

// Coordinate convention:
//  - mx, my, mv = measured in in-game meters
//  - px, py, pv = measured in pixels

// pixels per meter
var viewScale = 5;
// global view offset
var viewPX = 0;
var viewPY = 0;
var viewFloor = null;

// current image set scaling and background grid image size
var imgScale = 5;
var bg_grid_width = 160;

// max and min zoom levels
var maxViewScale = 60;
var minViewScale = 0.2;
// roughly how many pixels does a mousewheel have to scroll to translate to a 2x zoom in or 0.5x zoom out
var wheel2xZoomScale = 200;
// square of the distance the mouse/touch has to be dragged before drag kicking in
var dragThresholdSquared = 10 * 10;
// actual door snap sensitivity is 2x this
var doorSnapPixels = 25;

// enable the fun stuff
var debugEnabled = false;

function setViewP(newViewPX, newViewPY, newViewScale, newViewFloor = null) {
	var refreshFloor = false;

	clearMenus();

	viewPX = newViewPX;
	viewPY = newViewPY;
	viewScale = newViewScale;
	if (viewFloor == null && newViewFloor == null) {
		newViewFloor = 0;
	}
	if (newViewFloor != null && newViewFloor != viewFloor) {
		viewFloor = newViewFloor;
		refreshFloor = true;
	}

	var grid = document.getElementById("grid");
	grid.style.backgroundPosition = viewPX + "px " + viewPY + "px";
	// We can't just use background-size because it blurs the image for no good reason
	// so we have to know the exact size of bg-grid.png
	var w = (bg_grid_width * viewScale / imgScale);
    grid.style.backgroundSize = w + "px " + w + "px";

	if (refreshFloor) {
	    for (var r = 0; r < roomList.length; r++) {
			roomList[r].removeDisplay();
		}

		setSelectedFloor(viewFloor);

        // clear any selections when we change floors, undoing this will revert
        // the view to the previous floor
		if (selectedRooms.length > 0) {
		    selectRooms([]);
		}
	}

    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];
		if (refreshFloor) {
		    room.addDisplay(getRoomContainer());

	    } else {
	        // We just need to update door bounding boxes when the zoom changes
	        room.updateDoorPositions();
	    }
    }

    // change one transform on the room container element, this will move all rooms simultaneously
    getRoomContainer().style.transform = getContainerTransform(viewPX, viewPY, viewScale);

	saveViewToUrl();
}

function getContainerTransform(viewPX, viewPY, viewScale) {
    // https://www.w3schools.com/cssref/css3_pr_transform.asp
    // translate() need to be before scale()
    return "translate(" + (viewPX) + "px, " + (viewPY) + "px) scale(" + viewScale + ", " + viewScale + ") ";
}

function redraw() {
	// force an update to all positions and views
	setViewP(viewPX, viewPY, viewScale);

	// need to force redraw on rooms separately, because setViewP() doesn't do that anymore
    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];
        room.updateDoorPositions();
        room.updateView();
    }
}

function getRoomContainer() {
	return document.getElementById("roomContainer");
}

function getRoomNoTransformContainer() {
	return document.getElementById("roomNoTransformContainer");
}

//==============================================================
// model state
//==============================================================

var roomList = Array();

function getRoomMetadata(id) {
    var rmd = roomMetadata.rooms.find(room => room.id == id);
    if (!rmd) {
        throw "Unknown room id: " + id
    }
    return rmd;
}

function removeRoom(room, updateTree=true) {
	removeFromList(roomList, room);
	removeFloorRoom(room);
	room.disconnectAllDoors();
	room.removeCollisions();
	runRulesOnRoomRemoved(room);
	room.removeDisplay();
	room.dispose();
    if (updateTree) {
        saveModelToUrl();
        treeUpdated();
    }
}

function addRoom(room, updateTree=true) {
	addToListIfNotPresent(roomList, room);
	addFloorRoom(room);
	runRulesOnRoomAdded(room);
    if (updateTree) {
    	saveModelToUrl();
        treeUpdated();
    }
}

function rotateSelectedRoom() {
    // if we're not currently dragging rooms then start a new move action
    if (!isDraggingRoom()) {
		var action = new MoveRoomAction(selectedRooms);
    }

    // easy case for one selected room
	if (selectedRooms.length == 1) {
	    // just rotate the room around its center
	    selectedRooms[0].rotate();
	    // todo: why do I need this here?
	    selectedRooms[0].updateView();

	} else {
	    // pick a center of rotation
	    var center;
	    if (isDraggingRoom()) {
	        // for rotating while dragging, use the center of the room that was actually clicked and dragged as the
	        // rotation center
	        center = mouseDownTarget.room.mv;

            // simple case, already dragging
            for (var r = 0; r < selectedRooms.length; r++) {
                // rotate each room around the center
                selectedRooms[r].rotateAround(center);
                // todo: why do I need this here?
                selectedRooms[r].updateView();
            }

	    } else {
    	    if (getCurrentMenuLevel > 0 && lastClickedRoom) {
                // for the rotate menu option, use the center of the room that was actually clicked as the rotation center
                center = lastClickedRoom.mv;

            } else {
                // find the center of bounds, snapped to the nearest 1m
                center = new DojoBounds(selectedRooms).centerPosition().toVect();
            }

            // simulate the drag process so we can rotate the selection as a unit without losing internal door settings
            for (var r = 0; r < selectedRooms.length; r++) {
                // start a drag process with the given selection
                selectedRooms[r].ignoreRooms = selectedRooms;
                selectedRooms[r].setDragOffset(0, 0, 0, false);
                selectedRooms[r].disconnectAllDoors();
            }
            // all rooms must be in the dragging state with doors disconnected before we actually rotate
            for (var r = 0; r < selectedRooms.length; r++) {
                // rotate each room around the center
                selectedRooms[r].rotateAround(center);
                // stop the drag process and commit the move
                selectedRooms[r].dropDragOffset();
                selectedRooms[r].ignoreRooms = null;
                // todo: why do I need this here?
                selectedRooms[r].updateView();
            }
        }
    }
    // if we're not dragging then force the new undo action to store the new
    // room positions by making it check if this qualifies as a move
	if (!isDraggingRoom() && action.isAMove()) {
	    // add the action
        addUndoAction(action);
        saveModelToUrl();
        treeUpdated();
	}
}

function rotateFloorSelectedRoom() {
    // this is only supported when a single room is selected
	if (selectedRooms.length == 1) {
		var action = new MoveRoomAction(selectedRooms);
	    removeFloorRoom(selectedRooms[0]);
	    selectedRooms[0].rotateFloor();
	    addFloorRoom(selectedRooms[0]);
	    selectedRooms[0].updateView();
		saveModelToUrl();
        if (action.isAMove()) {
            addUndoAction(action);
            treeUpdated();
        }
	}
}

function deleteSelectedRooms() {
	if (selectedRooms.length > 0) {
	    // save a copy of the selected room list and reset the selection
	    // not sure if this is necessary, but maybe something weird happens when
	    // deleting a room that's selected
		var oldRooms = selectedRooms;
	    selectedRooms = [];
	    // create the action before disconnecting doors
	    var action = new AddDeleteRoomsAction(oldRooms, false);
	    // deselect and remove each room;
        for (var r = 0; r < oldRooms.length; r++) {
            oldRooms[r].deselect();
    	    removeRoom(oldRooms[r], false);
        }
	    clearMenus(0);
	    // add an undo action
	    addUndoAction(action);
	}
    saveModelToUrl();
    treeUpdated();
}

function doAddRooms(e, rooms) {
    // loop over the new rooms
    for (var r = 0; r < rooms.length; r++) {
        // todo: use setPosition?
        // get the room's "base" floor
        var floor = rooms[r].floor;
        // hack: if it's a brand new room then the floor will still be 100 from
        // calculating the anchor point
        if (floor == 100) floor = 0;
        // set the floor directly to 100, then go through setFloor to change the floor
        // and initialize all the display elements
        // todo: this is stupid
        rooms[r].floor = 100;
        // offset the base floor with the currently viewed floor
        rooms[r].setFloor(viewFloor + floor);
        // propagate the debug flag
        if (debugEnabled) {
            rooms[r].setDebug(true);
        }
        // add the room to the room list
        // disable the tree update, we're going to be dragging these rooms immediately
        addRoom(rooms[r], false);
    }

    // not quite sure why this works
    mouseDownTargetStartPX = viewPX;
    mouseDownTargetStartPY = viewPY;

    // start the drag process directly, the rooms will follow the cursor until
    // it is clicked and released
    // We need an anchor element, so pull either the display or otherFloorDisplay from the first room
    startNewRoomDrag(e, rooms, rooms[0].display ? rooms[0].display : rooms[0].otherFloorDisplay);
	// undo action will be created when the room is dropped
}

function duplicateSelectedRooms(e) {
    // sanity check
	if (!dragged && selectedRooms.length > 0) {
	    // clone the rooms
		var rooms = cloneRooms(selectedRooms);
	    clearMenus(0);

        // add the rooms
	    doAddRooms(e, rooms);
	}
}

function copySelectedRooms() {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // create a position-normalized copy of the rooms and put it in our clipboard
        copiedRooms = cloneRooms(selectedRooms);
    }
}

function cutSelectedRooms() {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // copy + delete
        copySelectedRooms();
        deleteSelectedRooms();
    }
}

function pasteCopiedRooms() {
    if (copiedRooms) {
        clearMenus(0);
        // create a copy of the rooms in the clipboard, not bothering to normalize
        // positions, and start the add process.
        doAddRooms(lastMTEvent, cloneRooms(copiedRooms, false));
    }
}

function selectAllRoomsOfSelectedTypes() {
    // wrapper to call selectAllRoomsOfType with the current selection
    if (selectedRooms.length > 0) {
        selectAllRoomsOfType(selectedRooms);
        clearMenus();
    }
}

function setSelectedRoomsLabels(label, action) {
    if (selectedRooms.length == 1) {
        clearMenus(0);
        // use the room on the existing action
        action.room.setLabel(label);
        // check if it was actually a change
        if (action.isAChange()) {
            // commit the action
            addUndoAction(action);
        	saveModelToUrl();
        }
    }
}

function clearSelectedRoomsLabels(action) {
    // set labe to null
    setSelectedRoomsLabels(null, action);
}

function setSelectedRoomsColor(hue, action, override=null) {
    if (selectedRooms.length > 0) {
        clearMenus(0);
        // use the room list on the existing action
        for (var r = 0; r < action.rooms.length; r++) {
            action.rooms[r].setHue(hue, override);
        }
        // check if it was actually a change
        if (action.isAChange()) {
            // commit the action
            addUndoAction(action);
        	saveModelToUrl();
        }
    }
}

function clearSelectedRoomsColor(action) {
    // set the hue to null
    setSelectedRoomsColor(null, action);
}

function movedSelectedRoom() {
	saveModelToUrl();
    treeUpdated();
}

function getCurrentSpawnRoom() {
    // todo: track this explicitly?
    return roomList.find((r) => { return r.isSpawnPoint(); } );
}

function setSpawnPointRoom(newSpawnRoom, allowUndo=true) {
    // factored out so we can call this when loading a layout
    var currentSpawnRoom = getCurrentSpawnRoom();
    // gotta check the metadata because I screwed up and thought a few rooms could be spawn points
    // when they can't
    if (!newSpawnRoom || newSpawnRoom.metadata.spawn) {
        if (currentSpawnRoom) {
            currentSpawnRoom.setSpawnPoint(false);
        }
        if (newSpawnRoom) {
            newSpawnRoom.setSpawnPoint(true);
        }
        if (allowUndo) {
            addUndoAction(new ChangeSpawnPointAction(currentSpawnRoom, newSpawnRoom));
        }
    }
}

function setSelectedRoomSpawn() {
    // only applicable with a single room selected
    if (selectedRooms.length == 1) {
        var newSpawnRoom = selectedRooms[0];
        clearMenus(0);
        // set the spawn point
        setSpawnPointRoom(newSpawnRoom, true);
    	saveModelToUrl();
    	treeUpdated();
    }
}

function unsetSelectedRoomSpawn() {
    if (selectedRooms.length == 1) {
        clearMenus(0);
        setSpawnPointRoom(null, true);
    	saveModelToUrl();
    	treeUpdated();
    }
}

function selectBranch() {
    // only applicable with a single room selected
    if (selectedRooms.length == 1) {
        clearMenus(0);
        runBranchSelection(selectedRooms[0], true);
    }
}

function selectRoot() {
    // only applicable with a single room selected
    if (selectedRooms.length == 1) {
        clearMenus(0);
        runBranchSelection(selectedRooms[0], false);
    }
}

function selectSpawnRoom() {
    clearMenus(0);
    // get the current spawn room
    var room = getCurrentSpawnRoom();
    if (room) {
        // if there is a spawn room, set the selection to it
        selectRoom(room, true, false);
        // make sure it's in view
        centerViewOnIfNotVisible(room.mv.x, room.mv.y, room.floor);
    }
}

function doAutoSetCrossBranches() {
    clearMenus(0);
    // run the cross branch analysis
    autoSetCrossBranches();
}

function doResetAllStructure() {
    clearMenus(0);
    // start a combination undo operation
    startUndoCombo();
    // unset every cross branch door
	for (var r = 0; r < roomList.length; r++) {
		var doors = roomList[r].doors;
        for (var d = 0; d < doors.length; d++) {
            var door = doors[d];
            if (door.forceCrossBranch) {
                // use the function
                setDoorState(door, false, true);
            }
        }
	}
	// finishe the combo operation, we'll be able to undo all of this with a single operation
	endUndoCombo("Reset structure");

    saveModelToUrl();
    treeUpdated();
}

function doorClicked(e, door) {
    // sanity check if it's a connected door
    if (!door.otherDoor) {
        // ignore
    }
    // run the door menu
    doDoorMenu(e, door);
}

function setDoorForceCrossBranch(door, forceCrossBranch, allowUndo=true) {
    clearMenus(0);

    // set the door state
    setDoorState(door, forceCrossBranch, allowUndo);

    saveModelToUrl();
    treeUpdated();
}

function resetDoor(door, allowUndo=true) {
    clearMenus(0);

    // set the door state
    setDoorState(door, false, allowUndo);

    saveModelToUrl();
    treeUpdated();
}

function setDoorState(door, forceCrossBranch, allowUndo=true) {
    // start an action to record the before state
    var action = !allowUndo ? null : new ChangeDoorAction(door);

    // need to make sure all the doors that go between the same two rooms have the same state
    var doors = getDoorsToRoom(door.room, door.otherDoor.room);
    for (var d = 0; d < doors.length; d++) {
        var setDoor = doors[d];
        setDoor.setForceCrossBranch(forceCrossBranch);
    }

    // add undo action if necessary
    if (action && action.isAChange()) {
        addUndoAction(action);
    }
}

function showDoorMarkers() {
	for (var r = 0; r < roomList.length; r++) {
		roomList[r].showDoorMarkers();
	}
}

function hideDoorMarkers() {
	for (var r = 0; r < roomList.length; r++) {
		roomList[r].hideDoorMarkers();
	}
}

function setShowAllFloors(showAllFloors) {
    // set this before calling room.addDisplay(), otherwise nothing will happen
	settings.showAllFloors = showAllFloors;

	if (showAllFloors) {
	    // find rooms that are not visible on the current floor
	    // and add their displays
	    for (var r = 0; r < roomList.length; r++) {
	        var room = roomList[r];
	        if (!room.isVisible()) {
                room.addDisplay(getRoomContainer());
                // don't need to call updateView()?
	        }
		}

	} else {
	    // find rooms that are not visible on the current floor
	    // and remove their displays
	    for (var r = 0; r < roomList.length; r++) {
	        var room = roomList[r];
	        if (!room.isVisible()) {
                room.removeDisplay();
	        }
		}
	}

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setShowMapMarkers(showMapMarkers) {
    // set this before calling room.showMarkers(), otherwise nothing will happen
	settings.showMapMarkers = showMapMarkers;

	if (showMapMarkers) {
	    for (var r = 0; r < roomList.length; r++) {
	        // add markers for rooms visible on the current floor
	        var room = roomList[r];
	        if (room.isVisible()) {
                room.showMarkers();
                // need to updateView to get them placed correctly
                room.updateView();
	        }
		}

	} else {
	    for (var r = 0; r < roomList.length; r++) {
	        // hade markers for rooms visible on the current floor
	        // other markers should already not be visible
	        var room = roomList[r];
	        if (room.isVisible()) {
                room.hideMarkers();
	        }
		}
	}

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setShowLabels(showLabels) {
    // set this before calling room.updateLabelDisplay(), otherwise nothing will happen
	settings.showLabels = showLabels;

	if (showLabels) {
	    for (var r = 0; r < roomList.length; r++) {
	        var room = roomList[r];
	        // add the label and update its positioning
            room.updateLabelDisplay();
            room.updateView();
		}

	} else {
	    for (var r = 0; r < roomList.length; r++) {
	        var room = roomList[r];
	        // remove the label
            room.updateLabelDisplay();
		}
	}

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setDimRooms(dimRooms) {
    // set this before calling room.updateLabelDisplay(), otherwise nothing will happen
	settings.dimRooms = dimRooms;

    for (var r = 0; r < roomList.length; r++) {
        // there's already a function just for changing the room color
        roomList[r].resetColorDisplay();
    }

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setRulesEnabled(rulesEnabled) {
    // check
    if (rulesEnabled == settings.rulesEnabled) {
        return;
    }

    if (rulesEnabled) {
        // enable rules before running them
    	settings.rulesEnabled = true;
    	// start with initial errors/warnings
    	runNewDojoRules();
    	// pretend we're adding the rooms again
        for (var r = 0; r < roomList.length; r++) {
            runRulesOnRoomAdded(roomList[r]);
        }

    } else {
        for (var r = 0; r < roomList.length; r++) {
            // pretend the room was removed to remove rule errors/warnings
            runRulesOnRoomRemoved(roomList[r]);
            // some rules add errors when a room is removed, and by some rules I mean the prerequisite rule
            clearRulesOnRoom(roomList[r]);
        }
        // clear out all global warnings that aren't collisions
        clearNonCollisionWarnings();
        // disable rules after running them
    	settings.rulesEnabled = false;
    }

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setAutosave(autosave) {
    // set the setting first
    settings.autosave = autosave;

    // if autosave is being enabled, then save right now
    if (autosave) {
        saveModelToUrl();
    }

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

function setStructureChecking(structureChecking) {
    // set the setting first
    settings.structureChecking = structureChecking;

    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];
        room.refreshMarkers();
    }

    // just re-run tree traversal I don't care
    treeUpdated();

    // save setting at the end, if something goes wrong then it is not saved
	settings.save();
}

//==============================================================
// model URL handling
//==============================================================

function buildModelParam(urlencode=false) {
	var value = "";
	for (var r = 0; r < roomList.length; r++) {
		if (value.length > 0) {
			value += "_";
		}
		value += roomToString(roomList[r], urlencode);
	}
	return value;
}

function buildCompressedModelParam() {
    return LZString.compressToEncodedURIComponent(buildModelParam(false))
}

function saveModelToUrl() {
    // short circuit if we're currently loading the page, we don't need
    // a hundre save events on page loag
    if (settings.loading) {
        return;
    }

	if (debugEnabled) {
		modifyUrlQueryParam("m", buildModelParam(true));

	} else {
	    var modelString = buildCompressedModelParam();
		modifyUrlQueryParam("mz", modelString);
		// check for autosave
		if (settings.autosave) {
		    // the view is part of the autosave
            var view = buildViewParam();
            // schedule the autosave
            storage.autosaveItem(`v=${view}&mz=${modelString}`);
		}
	}
}

function loadModelFromHref() {
    return loadModelFromUrl(window.location.href);
}

function loadModelFromUrl(url) {
	var modelString = LZString.decompressFromEncodedURIComponent(getQueryParam(url, "mz"));
	if (!modelString) {
		// backwards compatible with the, uh, like maybe couple of dozen old URLs floating around.
		modelString = getQueryParam(url, "m");
		// make things easier and just remove the "m=" section so we can replace it with "mz="
		if (modelString) {
			removeUrlQueryParam("m");
		}
	}
	if (!modelString) {
		return false;
	}

    // parse the model string, accounting for quotes but not removing them
	var roomStrings = quotedSplit(modelString, "_", true);
	// set a flag so we don't do things like autosaving while we're building the layout
	settings.loading = true;
	var readRooms = [];
	for (var rs = 0; rs < roomStrings.length; rs++) {
		readRooms.push(roomFromString(roomStrings[rs], readRooms));
	}

	for (var rs = 0; rs < readRooms.length; rs++) {
	    var room = readRooms[rs];
        addRoom(room, false);
        room.resetPositionAndConnectDoors();
	}
	// save back to the URL without autosaving, and update the tree
    saveModelToUrl();
    treeUpdated();

	// clear he loading flag
	settings.loading = false;
	return true;
}

//==============================================================
// View handling
//==============================================================

function buildViewParam() {
	var centerPX = viewPX - (window.innerWidth / 2);
	var centerPY = viewPY - (window.innerHeight / 2);

	var value = viewScale.toFixed(1) + "," + Math.round(centerPX) + "," + Math.round(centerPY) + "," + viewFloor;
	return value;
}

function saveViewToUrl() {
	modifyUrlQueryParam("v", buildViewParam());
	// no autosave just for view changes
}

function loadViewFromHref() {
    return loadViewFromUrl(window.location.href);
}

function loadViewFromUrl(url) {
	var viewString = getQueryParam(url, "v");
	if (!viewString) {
		return false;
	}
	var s = viewString.split(",");
	var scale = parseFloat(s[0]);
	var centerPX = parseInt(s[1]);
	var centerPY = parseInt(s[2]);
	var floor = s.length > 3 ? parseInt(s[3]) : 0;

	var cornerPX = centerPX + (window.innerWidth / 2);
	var cornerPY = centerPY + (window.innerHeight/ 2);

	setViewP(cornerPX, cornerPY, scale, floor);
	return true;
}

function buildUrlParams() {
	// this is called from the Save button
	return "?v=" + buildViewParam() + (debugEnabled
		? "&m=" + buildModelParam()
		: "&mz=" + LZString.compressToEncodedURIComponent(buildModelParam()));
}

function centerViewOn(mx, my, scale = null, floor = null) {
	var newScale = scale != null ? scale : viewScale;
	var newfloor = floor != null ? floor : viewFloor;

	// (newPX, newPY) is where the model grid point (0, 0) is
	var newPX = (windowWidth / 2) - (mx * newScale);
	var newPY = (windowHeight / 2) - (my * newScale);
	setViewP(newPX, newPY, newScale, newfloor);
}

function centerViewOnIfNotVisible(mx, my, floor, scale = null) {
	var px = (mx * viewScale) + viewPX;
	var py = (my * viewScale) + viewPY;
	if (floor != viewFloor || px < 0 || px > windowWidth || py < 0 || py > windowWidth) {
		centerViewOn(mx, my, scale, floor);
		return true;

	} else {
		return false;
	}
}

function centerViewOnBounds(viewCenter, bounds) {
    // feels like I'm overthinking this

    // changed flag
    var changed = false;

    if (viewCenter == null) {
        // default view center
        viewCenter = getViewCenter();
    }

    // get the current view floor
    var floor = viewFloor;

    // check if the bounds touch the visible floor
    if (bounds && (floor < bounds.f1 || floor > bounds.f2)) {
        // if we have a view center and it's in bounds then switch to that floor
        if (viewCenter.floor >= bounds.f1 && viewCenter.floor <= bounds.f2) {
            floor = viewCenter.floor;

        // otherwise change the view floor to the nearest one in bounds
        } else if (floor < bounds.f1) {
            floor = bounds.f1;

        } else {
            floor = bounds.f2;
        }
        changed = true;

    } else if (!bounds && viewCenter.floor != floor) {
        // no bounds, just go straight to the previous view
        floor = viewCenter.floor
        changed = true;
    }

    // add a margin around whatever we scale the view to, use the same margin as the autoScroll area
    var margin = autoScrollSize / viewScale;
    // convert view parameters to a bounding box in model coordinates
    // why did I make viewPX and viewPY so weird
    var viewx1 = (-viewPX / viewScale) + margin;
    var viewx2 = ((-viewPX + windowWidth) / viewScale) - margin;
    var viewy1 = (-viewPY / viewScale) + margin;
    var viewy2 = ((-viewPY + windowHeight) / viewScale) - margin;
    var scale = viewScale;

    if (viewx1 > bounds.x1) {
        // move the view left just enough to include the left bounds
        viewx2 += bounds.x1 - viewx1;
        viewx1 = bounds.x1;
        changed = true;
    } else if (viewx2 < bounds.x2) {
        // move the view right just enough to include the right bounds
        viewx1 += bounds.x2 - viewx2;
        viewx2 = bounds.x2;
        changed = true;
    }
    if (viewx1 > bounds.x1 || viewx2 < bounds.x2) {
        // view is not zoomed out enough to include both the left and right bounds
        // calculate rescale factor
        var rescale = (bounds.x2 - bounds.x1) / (viewx2 - viewx1);
        // set the horizontal view to exactly cover the horizontal bounds
        viewx1 = bounds.x1;
        viewx2 = bounds.x2;
        // convert vertical view to midpoint and distance
        var midy = (viewy1 + viewy2) / 2;
        var disty = (viewy2 - viewy1) / 2;
        // zoom the vertical view out from its center to match the new scaling
        viewy1 = midy - (disty * rescale);
        viewy2 = midy + (disty * rescale);
        // scale the scale
        scale /= rescale;
        changed = true;
    }

    if (viewy1 > bounds.y1) {
        // move the view up just enough to include the upper bounds
        viewy2 += bounds.y1 - viewy1;
        viewy1 = bounds.y1;
        changed = true;
    } else if (viewy2 < bounds.y2) {
        // move the view down just enough to include the lower bounds
        viewy1 += bounds.y2 - viewy2;
        viewy2 = bounds.y2;
        changed = true;
    }
    if (viewy1 > bounds.y1 || viewy2 < bounds.y2) {
        // view is not zoomed out enough to include both the upper and lower bounds
        // calculate rescale factor
        var rescale = (bounds.y2 - bounds.y1) / (viewy2 - viewy1);
        // set the vertical view to exactly cover the vertical bounds
        viewy1 = bounds.y1;
        viewy2 = bounds.y2;
        // convert horizontal view to midpoint and distance
        var midx = (viewx1 + viewx2) / 2;
        var distx = (viewx2 - viewx1) / 2;
        // zoom the horizontal view out from its center to match the new scaling
        viewx1 = midx - (distx * rescale);
        viewx2 = midx + (distx * rescale);
        // scale the scale
        scale /= rescale;
        changed = true;
    }

    if (changed) {
        // convert back to the weird view parameters I seem to be using
        var newPX = (-viewx1 * scale) + autoScrollSize;
        var newPY = (-viewy1 * scale) + autoScrollSize;
        // reset the view
        setViewP(newPX, newPY, scale, floor);
    }
}

function getViewCenter() {
	var mx = ((windowWidth / 2) - viewPX) / viewScale;
	var my = ((windowHeight / 2) - viewPY) / viewScale;
	var ret = {mx: mx, my: my, floor: viewFloor, scale: viewScale}
	return ret
}

//==============================================================
// Misc
//==============================================================

function setModelDebug(debug) {
    for (var r = 0; r < roomList.length; r++) {
        roomList[r].setDebug(debug);
    }
    redraw();
}

//==============================================================
// State, initialization
//==============================================================

function initModel() {
	registerRoomRules(roomMetadata);

    if (loadModelFromHref()) {
		if (!loadViewFromHref()) {
			var room = roomList[0];
			if (room) {
		        centerViewOn(room.mv.x, room.mv.y, 5, room.floor);
			} else {
		        centerViewOn(0, 0, 5, 0);
			}
		}

    // if there is no layout in the URL then check local storage for an autosve
    } else if (settings.autosave && storage.containsAutosaveItem()) {
        // load the autosave entry
        // we need to prefix it with "?" so the URL parser will work
        var url = "?" + storage.getAutosaveItem();
        loadModelFromUrl(url);
        loadViewFromUrl(url);

    } else {
        // set the view first so "v=" appears at the beginning of the URL
        centerViewOn(0, 0, 2, 0);
        var starterRoom = new Room(getRoomMetadata("h1"));
        starterRoom.setPosition(0, 0, 0, 0);
        // I smell hax
        starterRoom.placed = true;
	    addRoom(starterRoom);
    }

    redraw();
}
