//==============================================================
// wrapper for handling both mouse and touch events
//==============================================================

var lastMTEvent = null;

class MTEvent {
	constructor(isTouch, currentTarget, clientX, clientY, altKey, shiftKey, ctrlKey) {
		this.isTouch = isTouch;
		this.currentTarget = currentTarget;
		this.clientX = clientX;
		this.clientY = clientY;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
		this.ctrlKey = ctrlKey;
		lastMTEvent = this;
	}
}

//==============================================================
// Touch event wrapper layer
//==============================================================

var lastTouchEvent = null;
var lastTouchIdentifier = null;

function touchEventToMTEvent(e) {
//	var show = "touch:";
//    for (var t = 0; t < e.touches.length; t++) {
//        show += " " + e.touches[t].clientY + " (" + e.touches[t].identifier + ")";
//    }
//    showDebug(show);

	// this gets tricky because the first touch in the list may not necessarily be the first touch, and
	// you can end multi-touch with a different touch than the one you started with
	var primary = null;

	if (e.touches.length > 0) {
		// default to the touch identifier we had before
        var identifier = lastTouchIdentifier;
	    if (identifier != -1) {
	        // if we have a previous identifier, then search the touch list for the corresponding touch
	        for (var t = 0; t < e.touches.length; t++) {
		        if (e.touches[t].identifier == identifier) {
		            primary = e.touches[t];
		            break;
		        }
	        }
	    }
	    // if we had no previous touch, or our previous primary touch has disappeared, fall back to the first
	    // touch in the list
	    if (!primary) {
		    primary = e.touches[0];
	    }
	}

    if (primary) {
        // we can generate an event, yay our team
        lastTouchEvent = new MTEvent(true, primary.target, primary.clientX, primary.clientY, e.altKey, e.shiftKey)
        // save the identifier for next time
        lastTouchIdentifier = primary.identifier;
	    return lastTouchEvent;

    } else if (lastTouchEvent != null) {
        // If a touch ends then we need to look at last event to know where the touch was when it ended
	    return lastTouchEvent;

    } else {
        // probably going to fail
        // todo: remove eventually. I'm pretty sure this can't happen any more
        // Update, it does happen, but I only saw it once and can't replicate it
        showDebug("Generating bogus touch event");
	    return new MTEvent(true, null, 0, 0, false, false);
    }
}

// zoom state
var touchZooming = false;
// center point of the zoon
var touchZoomCenter = null;
// distance between touches
var touchZoomRadius = 0;
// last distance between touches
var lastTouchZoomRadius = 0;

function calcTouchZoom(e) {
	// calculate the midpoint between the two touches
	var tv1 = new Vect(e.touches[0].clientX, e.touches[0].clientY)
	var tv2 = new Vect(e.touches[1].clientX, e.touches[1].clientY)
	touchZoomCenter = tv1.add(tv2);
	touchZoomCenter.scale(0.5);
	// calculate the distance between the two touches
	touchZoomRadius = tv1.subtract(tv2).length();
}

function touchStart(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
        // just one touch, treat like a mouse down event
	    downEvent(touchEventToMTEvent(e));

    } else if (e.touches.length == 2) {
        // double touch means it's zoom time
        if (!touchZooming) {
            // initialize the zoom state so we have something to compare with when the touches move
            touchZooming = true;
            calcTouchZoom(e);
        }
	}

	// todo: triple-or-more touches are basically ignored, do something with those?
}

function touchMove(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 1) {
        // just one touch, treat like a mouse drag
	    dragEvent(touchEventToMTEvent(e));

    } else if (e.touches.length == 2) {
        // double touch means it's zoom time
        if (!touchZooming) {
            // initialize the zoom state so we have something to compare with when the touches move again
            // todo: does initializing here ever actually happen?
            touchZooming = true;
            calcTouchZoom(e);

        } else {
            // save the last zoom radius
            lastTouchZoomRadius = touchZoomRadius;
			// calculate the new zoom center and radius
            calcTouchZoom(e);

			// treat like a mouse/scroll at the midpoint between two zooms and a zoom factor equal to the ratio
			// between the previous and current touch radii
			zoom(touchZoomCenter.x, touchZoomCenter.y, touchZoomRadius/lastTouchZoomRadius);
        }

        // continue dragging with one of the touches, this magically works
        dragEvent(touchEventToMTEvent(e));
    }

	// todo: triple-or-more touches are basically ignored, do something with those?
}

function touchEnd(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.touches.length == 0) {
        // no more touches, stop zooming
        touchZooming = false;
        // treat like a mouse up, touchEventToMTEvent() will need to refer to our last touch event to get the point
        // at which the touch ended
        dropEvent(touchEventToMTEvent(e));
        // clear out any lingering touch state
        lastTouchEvent = null;
        lastTouchIdentifier = -1;

    } else if (e.touches.length == 1) {
        // stop zooming
        touchZooming = false;
        if (mouseDownTarget) {
			// we were dragging a room before
			// leave mouseDownTargetStartPX/Y alone, the currently dragging room will magically either stay on the
			// same touch or transfer to the new touch

        } else {
	        // we were only dragging the view, so simply reset the drag offset.
	        // the new touch will continue the drag, whichever one it is
		    mouseDownTargetStartPX = e.touches[0].clientX;
		    mouseDownTargetStartPY = e.touches[0].clientY;
        }

    } else if (e.touches.length == 2) {
		// todo: triple-or-more touches are basically ignored, do something with those?
		// for now, just reset our zoom state if we were zooming before the triple-touch happened
        if (touchZooming) {
            calcTouchZoom(e);
        }
    }
}

function touchCancel(e) {
    e = e || window.event;
    e.preventDefault();

	cancelRoomDrag();
	touchZooming = false;
}

//==============================================================
// Mouse event wrapper layer
//==============================================================

function mouseEventToMTEvent(e) {
	return new MTEvent(false, e.currentTarget, e.clientX, e.clientY, e.altKey, e.shiftKey, e.ctrlKey || e.metaKey);
}

function mouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    downEvent(mouseEventToMTEvent(e));
}

function contextMenu(e) {
    e = e || window.event;
    e.preventDefault();
    var evt = mouseEventToMTEvent(e);

	// super hack: Treat right-click as selecting a room (click and release), and then clicking again to bring up
	// the menu
    downEvent(evt);
    dropEvent(evt);
    downEvent(evt);
    return false;
}

function mouseMove(e) {
    e = e || window.event;
    e.preventDefault();

    dragEvent(mouseEventToMTEvent(e));
}

function mouseUp(e) {
    e = e || window.event;
    e.preventDefault();

    dropEvent(mouseEventToMTEvent(e));
}

function wheel(e) {
    e = e || window.event;
    e.preventDefault();

    var deltaY = e.deltaY;

	// Firefox actually uses "lines" mode instead of "pixels" mode.
    if (e.deltaMode == 1) {
		// Just make it similar to what Chrome puts out, because I'm not spinning up an iFrame with no CSS just to
		// measure the system default line size.
		deltaY *= 33;
    }

	var factor = Math.pow(2, -deltaY / wheel2xZoomScale)

    clearMenus(0);

	zoom(e.clientX, e.clientY, factor);
}

//==============================================================
// Unified event handling
//==============================================================

var mouseDownTarget = null;
var mouseDownTargetStartPX = 0;
var mouseDownTargetStartPY = 0;
var selectedRooms = [];
var copiedRooms = null;
var lastClickedRoom = null;
var dragged = false;
var dragMoveUndoAction = false;
var newRoom = false;

var multiselectEnabled = false;
var multifloorEnabled = false;
var multiselectCornerPX = null;
var multiselectCornerPY = null;

var snapDisabled = false;

// adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
function downEvent(e) {
	if (mouseDownTarget != null) {
		return;
	}

    clearMenus(0);

    // get the mouse cursor position at startup:
    mouseDownTargetStartPX = e.clientX;
    mouseDownTargetStartPY = e.clientY;

    if (e.currentTarget.room) {
        if (multiselectEnabled) {
            // set up for adding a room to the selection
	        mouseDownTarget = e.currentTarget;

        } else {
            if (e.altKey) {
                // insta-delete

                // if you ald-click on a room that's not selected, then
                // change the selection, so it can be undone later
                if (!selectedRooms.includes(e.currentTarget.room)) {
                    selectRoom(e.currentTarget.room, false, false);
                }

                // now we can just use the usual delete method
                deleteSelectedRooms();

            } else {
                mouseDownTarget = e.currentTarget;
                mouseDownTarget.room.setClickPoint(mouseDownTargetStartPX, mouseDownTargetStartPY);
                // If a selected room was clicked then make sure all selected rooms have a click point
                if (selectedRooms.includes(mouseDownTarget.room)) {
                    for (var r = 0; r < selectedRooms.length; r++) {
                        selectedRooms[r].setClickPoint(mouseDownTargetStartPX, mouseDownTargetStartPY);
                    }
                }
                // clear the new room flag before we start dragging
                newRoom = false;
            }
        }
    }

    // start the drag process
	startDrag();
}

function startNewRoomDrag(e, rooms, target) {
    mouseDownTarget = target;
    // going t combine a selection action and new room action into one undo action
    // this way, undo will both delete the added room and select the previously
    // selected room(s).
    startUndoCombo();
    // deselect currntly selected rooms
    selectRooms([], false, true);
    // select the new room(s), but don't add another selection action.
    selectRooms(rooms, false, false);

    // make sure all the new rooms have a click point
    for (var r = 0; r < rooms.length; r++) {
        rooms[r].setClickPoint(e.clientX, e.clientY);
    }

    // set the new room flag before we start dragging
    newRoom = true;

    // start the drag process
	startDrag();
	// call teh drag handler immediately to force the room to start under the cursor
	dragEvent(e);
}

function startDrag() {
    // call a function when the cursor moves:
    document.onmousemove = mouseMove;
    // call a function when the button is released:
    document.onmouseup = mouseUp;

	dragTarget = document;
    // call a function when a touch moves:
    dragTarget.ontouchmove = touchMove;
    // call a function when a touch leaves:
    dragTarget.ontouchend = touchEnd;
}

function isDraggingRoom() {
    // lots going on to try and tell if we're draggina  room
    return mouseDownTarget && mouseDownTarget.room && selectedRooms.includes(mouseDownTarget.room) && !multiselectEnabled;
}

function isMultiselecting() {
    // telltale for when multiselecting is happening
    return multiselectCornerPX != null;
}

function dragEvent(e) {
    // calculate the new cursor position:
    var offsetPX = e.clientX - mouseDownTargetStartPX;
    var offsetPY = e.clientY - mouseDownTargetStartPY;

    // give some wiggle room so the cursor doesn't have to be perfectly
    // still to count as a click instead of a drag
    if (!dragged && ((offsetPX * offsetPX) + (offsetPY * offsetPY) < dragThresholdSquared)) {
        return;
    }

    if (isDraggingRoom()) {
        // Convert offset to model coordinates and snap to the nearest meter
        var offsetM = new Vect(
            Math.round(offsetPX / viewScale),
            Math.round(offsetPY / viewScale));

        // calculate the cursor position in model coordinates
        var clickM = new Vect(
            Math.round((e.clientX - viewPX) / viewScale),
            Math.round((e.clientY - viewPY) / viewScale));

        // if this is the first time then initialize the undo action with the starting positions
        if (!dragged && !newRoom) {
            dragMoveUndoAction = new MoveRoomAction(selectedRooms);
        }

        // handle room drag
        // 8m snapping is enabled with ctrl/meta key
        handleRoomDrag(offsetM, clickM, e.ctrlKey, dragged);

        // todo: necessary?
	    for (var r = 0; r < selectedRooms.length; r++) {
    	    selectedRooms[r].updateView();
        }

        // scroll the screen if we're close enough to an edge
	    checkAutoScroll(e);

    } else if (multiselectEnabled) {
        // start the multiselect state
        if (!isMultiselecting()) {
            // init the multiselect box coordinates
            mouseDownTargetStartPX = e.clientX;
            mouseDownTargetStartPY = e.clientY;
            multiselectCornerPX = e.clientX;
            multiselectCornerPY = e.clientY;
            // show the box
    	    showMultiselectBox();

        } else {
            // update the multiselect box coordinates
            multiselectCornerPX = e.clientX;
            multiselectCornerPY = e.clientY;
    	    updateMultiselectBox(e);
            // scroll the screen if we're close enough to an edge
    	    checkAutoScroll(e);
        }

    } else {
        // nothing else we could be dragging, so drag the screen
		mouseDownTarget = null;
	    mouseDownTargetStartPX = e.clientX;
	    mouseDownTargetStartPY = e.clientY;

	    if (e.ctrlKey) {
	        // ctrl + drag just autoscrolls when the cursor is near the edge
    	    checkAutoScroll(e);

	    } else {
	        // normal operation just drags the screen
            setViewP(viewPX + offsetPX, viewPY + offsetPY, viewScale);
	    }
    }

    // set the dragged flag
    dragged = true;
}

function handleRoomDrag(offsetM, clickM, ctrlKey) {
    // track the best door pair for snapping
    var snapDoor = null;
    var snapOtherDoor = null;

    if (!snapDisabled) {
        for (var r = 0; r < selectedRooms.length; r++) {
            // make sure the room is ignoring all selected rooms for checking doors and bounds
            selectedRooms[r].ignoreRooms = selectedRooms;
            // set the room's new position and door positions
            // don't commit in case we need to change the offset for snapping
            selectedRooms[r].setDragOffset(offsetM.x, offsetM.y, null, false);
            // find the best door pair for snaping this room
            var doorPair = selectedRooms[r].getClosestDoorSnapPair();
            // if there's a door snap pair
            if (doorPair) {
                // replace the current door pair if there isn't one or if the new one is closer to the cursor
                if (!snapDoor ||
                        doorPair.door.mv.distanceSquared(clickM) < snapDoor.mv.distanceSquared(clickM)) {
                    snapDoor = doorPair.door;
                    snapOtherDoor = doorPair.otherDoor;
                }
            }
        }
    }
    // show door markers before snapping, in case any doors reconnect after snapping
    if (!dragged) {
        showDoorMarkers();
    }

    var newOffsetM = null;

    // did we find a pair of doors to snap?
    if (snapDoor && snapOtherDoor) {
        // calculate the difference between the two door positions
        // adjust the drag offset
        newOffsetM = offsetM.add(snapOtherDoor.mv.subtract(snapDoor.mv));

    // Are we dragging with the shift key down?
    } else if (ctrlKey) {
        // calculate the round adjustment using the dragged location of the clicked room
        var refM = mouseDownTarget.room.mv.add(offsetM);
        // round to the nearest 8m
        var roundM = refM.round(8);
        // adjust the drag offset
        newOffsetM = offsetM.add(roundM.subtract(refM));
        // console.log(`${refM} -> ${roundM} : ${offsetM} -> ${newOffsetM}`);

    } else {
        // no snapping
        newOffsetM = offsetM;
    }

    // redo the drag offset and commit it this time
    for (var r = 0; r < selectedRooms.length; r++) {
        selectedRooms[r].setDragOffset(newOffsetM.x, newOffsetM.y, null, true);
    }
}

function dropEvent(e) {
    if (multiselectEnabled) {
        // were we multiselecting
        if (isMultiselecting()) {
            stopMultiselecting();
            dragged = false;

        } else {
            // It was a click instead of a drag
            /// Add a room to the selection if a room was clicked, otherwise clear the selection.
			selectRoom(!mouseDownTarget ? null : mouseDownTarget.room, undoable = true, true);
        }

    } else if (isDraggingRoom()) {
        // save the clicked room, if any
        lastClickedRoom = (mouseDownTarget && mouseDownTarget.room) ? mouseDownTarget.room : null;
        // we also need the last clicked door, if any
        lastClickedDoor = (mouseDownTarget && mouseDownTarget.door) ? mouseDownTarget.door : null;
	    mouseDownTarget = null;
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;

        // if we actually dragged some distance
		if (dragged) {
		    // commit the move for each selected room
    	    for (var r = 0; r < selectedRooms.length; r++) {
                selectedRooms[r].dropDragOffset();
                // update the view
                selectedRooms[r].updateView();
                // clear the ignore list
    	        selectedRooms[r].ignoreRooms = null;
            }
            dragged = false;

            // no more door markers
            hideDoorMarkers();

            if (!dragMoveUndoAction) {
                // if there was no undo action in progreses then these were
                // new rooms, create an add action to undo.
                addUndoAction(new AddDeleteRoomsAction(selectedRooms, true));

            // otherwise, check the in progress move action to see if anything
            // was actually moved
            } else if (dragMoveUndoAction.isAMove()) {
                // commit the move undo action
                addUndoAction(dragMoveUndoAction);
            }

            // clear out any combo undos.  This takes care of any possible combined
            // selection and addition actions
            endAllUndoCombos();

            // clear out any move action
            dragMoveUndoAction = null;

            // notify things that a room or rooms were moved
    		movedSelectedRoom();
		} else {
		    // room wasn't actually dragged anywhere, treat it as a click and
		    // open either the room or door menus
		    if (lastClickedDoor) {
    	        doorClicked(e, lastClickedDoor);
		    } else {
    			doRoomMenu(e, selectedRooms);
		    }
		}

	} else {
		if (!dragged) {
    	    // no multiselect and no dragging.  treat it as a simple click and either
    	    // select a single room/door or clear the selection
    	    if (mouseDownTarget && mouseDownTarget.door) {
    	        doorClicked(e, mouseDownTarget.door);
    	    } else {
    			selectRoom(!mouseDownTarget ? null : mouseDownTarget.room, undoable = true, false);
    	    }
		}

        // clear click and dragging state
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    dragged = false;
	}

    // clear out all the dragging mouse/touch listeners
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    mouseDownTarget = null;
    // stop auto-scrolling
    setAutoScroll(e, 0, 0)
}

// selection change involving a single room
function selectRoom(room, undoable = false, multiselect = false) {
    // save the old selected rooms
    var oldSelectedRooms = selectedRooms;
    var prevViewCenter = null;

    // One set of logic if we're not multiselecting
    if (!multiselect) {
        if (selectedRooms.includes(room)) {
            // the room is already selected, nothing to do
            // pretty sure this doesn't happen.
            return;
        }

        // clear out the old selections, if any
        if (oldSelectedRooms.length > 0) {
            for (var r = 0; r < oldSelectedRooms.length; r++) {
                oldSelectedRooms[r].deselect();
                oldSelectedRooms[r].updateView();
            }
        }
        // if we have a new selection
        if (room) {
            // clear out the selection before changing the view so it doesn't try to add an extra undo action
            selectedRooms = [];
            // go to the floor the room is on, if it's not on the current floor
            if (!room.isOnFloor()) {
                prevViewCenter = getViewCenter();
                setViewP(viewPX, viewPY, viewScale, room.floor, false);
            }

            // select just that one room
            selectedRooms = [room];
            // update the room's state
            room.select();
            room.updateView();

        } else if (oldSelectedRooms.length > 0) {
            // only reset selectedRooms if it wasn't already empty
            selectedRooms = [];
        }

    // selecting nothing while multiselect is active does nothing
    } else if (room) {
        if (!(lastMTEvent && lastMTEvent.ctrlKey) && !room.isOnFloor()) {
            // room is on a different floor, ignore
            return;

        } else if (selectedRooms.includes(room)) {
            // selecting an already selected room will deselect it
            // make a copy of the selected rooms list
            var newRooms = oldSelectedRooms.slice();
            // remove the deselected room
            removeFromList(newRooms, room);
            // change the selection
            selectedRooms = newRooms;
            // update the room's state
            room.deselect();
            room.updateView();

        } else {
            // multiselecting new room
            // make a copy of the selected rooms list
            var newRooms = oldSelectedRooms.slice();
            // add the newly selected room
            newRooms.push(room);
            // change the selection
            selectedRooms = newRooms;
            // update the room's state
            room.select();
            room.updateView();
        }
    }

    // check if this is an undoable section and the selection has changed
    if (undoable && oldSelectedRooms != selectedRooms) {
        // add a selection action to undo
        addUndoAction(new SelectionAction(oldSelectedRooms, selectedRooms), prevViewCenter);
    }
}

// selection change involving multiple rooms at once
function selectRooms(rooms, append=false, undoable=true) {
    // save the current selection
    var oldSelectedRooms = selectedRooms;
    // make a copy of the current selection
    var newSelectedRooms = selectedRooms.slice();
    // just have a flag for if something changes
    var selectionChanged = false;

    // check if we're not appending to the current selection
    if (!append) {
        // loop over the currently selected rooms
        for (var r = 0; r < oldSelectedRooms.length; r++) {
            // check if the currently selected room is nor in the new selection
            if (!rooms.includes(oldSelectedRooms[r])) {
                // update the old room's state
                oldSelectedRooms[r].deselect();
                oldSelectedRooms[r].updateView();
                // remove it from the new selection
                removeFromList(newSelectedRooms, oldSelectedRooms[r]);
                selectionChanged = true;
            }
        }
    }

    // todo: need this check?
    if (rooms) {
        // loop over the new roooms
        for (var r = 0; r < rooms.length; r++) {
            // check if the new room isn't already selected yet
            if (!oldSelectedRooms.includes(rooms[r])) {
                // update the newroom's state
                rooms[r].select();
                rooms[r].updateView();
                // add to the selection
                newSelectedRooms.push(rooms[r]);
                selectionChanged = true;
            }
        }
    }

    // check if there was any actual selection changes
    if (selectionChanged) {
        // if it's an undoable action
        if (undoable) {
            // add an undo action for the selection change
            addUndoAction(new SelectionAction(oldSelectedRooms, newSelectedRooms));
        }
        // commit new selection
        selectedRooms = newSelectedRooms;
    }
}

// Ctrl-A handler
function selectAllRoomsOnFloor() {
    // get every room that has at least some part on the current floor
    var rooms = [];
    for (var r = 0; r < roomList.length; r++) {
        if (roomList[r].getFloors().includes(viewFloor)) {
            rooms.push(roomList[r]);
        }
    }

    // replace the current selection
    selectRooms(rooms, false, true);
}

function selectAllRoomsLikeReallyAllOfThem() {
    selectRooms(roomList, false, true);
}

// select all rooms of a certain type
function selectAllRoomsOfType(matchingRooms) {
    // get every room that has at least some part on the current floor
    var rooms = [];
    var metadataIds = [];
    for (var r = 0; r < matchingRooms.length; r++) {
        addToListIfNotPresent(metadataIds, matchingRooms[r].metadata.id);
    }
    for (var r = 0; r < roomList.length; r++) {
        if (metadataIds.includes(roomList[r].metadata.id)) {
            rooms.push(roomList[r]);
        }
    }

    // replace the current selection
    selectRooms(rooms, false, true);
}

// select all rooms of a certain type
function selectAllRoomsOfColor(matchingRooms, type=-1) {
    function matchesHue(hue1, hue2) {
        return type == -1 ?
            arrayEquals(hue1, hue2) :
            (hue1 != null && hue2 != null && hue1[type] == hue2[type]);
    }

    // get every room that has at least some part on the current floor
    var rooms = [];
    var hues = [];
    for (var r = 0; r < matchingRooms.length; r++) {
        var hue = matchingRooms[r].hue;
        // filter out null color, for now.
        // I'm not ready for an easy way to select every room on every floor just yet.
        if (hue != null &&
            !hues.find(e => matchesHue(e, hue))) {
            hues.push(hue);
        }
    }
    for (var r = 0; r < roomList.length; r++) {
        if (hues.find(e => matchesHue(e, roomList[r].hue))) {
            rooms.push(roomList[r]);
        }
    }

    // replace the current selection
    selectRooms(rooms, false, true);
}

function cancelRoomDrag() {
    // check if we're actualyl dragging
    if (isDraggingRoom()) {
        // clear drag state
        mouseDownTarget = null;
        mouseDownTargetStartPX = 0;
        mouseDownTargetStartPY = 0;
        // see if we were dragging new rooms
		if (newRoom) {
			// no undo action, just remove the new rooms
		    for (var r = 0; r < selectedRooms.length; r++) {
    			removeRoom(selectedRooms[r]);
            }
            // stealth clear the selection
		    selectedRooms = [];

		} else {
		    // not new rooms, reset them
		    for (var r = 0; r < selectedRooms.length; r++) {
		        // reset to their original positions
                selectedRooms[r].resetDragOffset();
                // stop dragging
                selectedRooms[r].dropDragOffset();
                // update state
                selectedRooms[r].updateView();
		    }
		}

        // clear more drag state
	    mouseDownTarget = null;
	    dragged = false;
	    // no mor doors
        hideDoorMarkers();

        // unregister grad listeners
	    document.onmouseup = null;
	    document.onmousemove = null;
	    document.ontouchend = null;
	    document.ontouchmove = null;

        // cancel any pending undo combinations
        cancelAllUndoCombos();
        return true;

    } else {
        return false;
    }
}

function zoom(px, py, factor) {
	var mx = (px - viewPX) / viewScale;
	var my = (py - viewPY) / viewScale;

	var newViewScale = viewScale * factor;
	if (newViewScale > maxViewScale) {
		newViewScale = maxViewScale;
	} else if (newViewScale < minViewScale) {
        newViewScale = minViewScale;
    }
	var newViewPX = px - (mx * newViewScale);
	var newViewPY = py - (my * newViewScale);

	if (isMultiselecting()) {
		// Oh god we're multiselecting and zooming at the same time *sweats profusely*
		mouseDownTargetStartPX = (mouseDownTargetStartPX - viewPX) * (newViewScale / viewScale) + newViewPX;
		mouseDownTargetStartPY = (mouseDownTargetStartPY - viewPY) * (newViewScale / viewScale) + newViewPY;
		updateMultiselectBox(lastMTEvent);

	} else if (mouseDownTarget) {
		// Oh double god we're dragging and zooming at the same time *nosebleed*
		mouseDownTargetStartPX = (mouseDownTargetStartPX - viewPX) * (newViewScale / viewScale) + newViewPX;
		mouseDownTargetStartPY = (mouseDownTargetStartPY - viewPY) * (newViewScale / viewScale) + newViewPY;
	}

    // update the view
	setViewP(newViewPX, newViewPY, newViewScale);
}

//==============================================================
// multiselect state handling
//==============================================================

function doToggleMultiselect() {
    // flip the bit
    setMultiselectEnabled(!multiselectEnabled);
}

function setMultiselectEnabled(enabled) {
    // get the UI button
    var button = document.getElementById("multiselectButton")
    // if we're starting multiselect
    if (enabled) {
        // update state
        multiselectEnabled = true;
        // update the button
        var icon = multifloorEnabled ? "icon-multiselect-floors" : "icon-multiselect";
        button.className = "button";
        button.innerHTML = `<img src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x" alt="Disable Multiselect Mode"/>`;

    // if we're ending multiselect
    } else {
        // update state
        multiselectEnabled = false;
        // update the button
        button.className = "button-disabled";
        var icon = "icon-multiselect";
        button.innerHTML = `<img src="icons/${icon}.png" srcset="icons2x/${icon}.png 2x" alt="Enable Multiselect Mode"/>`;

        // check if we actually had a multiselect box going
		if (isMultiselecting()) {
		    stopMultiselecting();
		}
    }
}

function stopMultiselecting() {
    // hide the box
    hideMultiselectBox();
    // clear multiselect box state
    mouseDownTargetStartPX = multiselectCornerPX;
    mouseDownTargetStartPY = multiselectCornerPY
    multiselectCornerPX = null;
    multiselectCornerPY = null;
    // add any rooms inside the multiselect box to the current selection
    commitMultiselectRooms();
}

//==============================================================
// key event handling
//==============================================================

function nothingElseGoingOn() {
    // a lot of key shortcuts are disabled if there is anything else going on in the UI
    // things like a menu, or things that involve active dragging
    return getCurrentMenuLevel() == 0 && !isDraggingRoom() && !isMultiselecting();
}

function keyDown(e) {
    e = e || window.event;

    // ignore typing in a text box
    nodeName = e.target.nodeName;
    if (nodeName == "TEXTAREA") {
        return;
    }

    if (nodeName == "INPUT") {
        switch (e.code) {
            case "ShiftLeft" :
            case "ShiftRight" :
    		    // quick hack to allow disabling snapping in the color picker
                snapDisabled = true;
                break;
        }
        return;
    }

    switch (e.code) {
		case "Escape" :
		    // escape either cancels menus, cancels a drag operation, or clears the selection, in that order.
		    if (!clearLastMenu() &&
		        !cancelRoomDrag()) {
		        selectRooms([]);
            }
            e.preventDefault();
		    break;
		case "Backspace" :
		case "Delete" :
		    // deletes selected rooms
			if (!isDraggingRoom() && !isMultiselecting()) {
    			deleteSelectedRooms();
    			// prevent the browser from navigating backwards
                e.preventDefault();
            }
		    break;
		case "ArrowUp" :
		    // goes up a floor
			if (!isDraggingRoom() && !isMultiselecting()) {
                doFloorUp();
                e.preventDefault();
            }
		    break;
		case "ArrowDown" :
		    // goes down a floor
			if (!isDraggingRoom() && !isMultiselecting()) {
                doFloorDown();
                e.preventDefault();
            }
		    break;
		case "KeyD" :
		    // deletes selected rooms
			if (nothingElseGoingOn()) {
    			duplicateSelectedRooms(lastMTEvent);
                e.preventDefault();
            }
		    break;
		case "KeyR" :
		    // still allow ctrl-R to work normally
		    // allow rotation while dragging rooms, but not while in a menu or multiselecting
		    if (!e.ctrlKey && !e.metaKey && getCurrentMenuLevel() == 0 && !isMultiselecting()) {
    			rotateSelectedRoom(lastMTEvent);
                e.preventDefault();
		    }
		    break;
		case "ShiftLeft" :
		case "ShiftRight" :
		    // shift toggles multiselect mode on unless we're dragging a room
		    if (!isDraggingRoom()) {
    		    setMultiselectEnabled(true);
                e.preventDefault();
		    } else {
		        // disables snap when we are dragging a room
		        snapDisabled = true;
                e.preventDefault();
		    }
		    // drag snapping is taken care of elsewhere
		    break;
		case "ControlLeft" :
		case "ControlRight" :
		case "MetaLeft" :
		case "MetaRight" :
		    multifloorEnabled = true;
		    if (multiselectEnabled) {
    		    setMultiselectEnabled(true);
                e.preventDefault();
		    }
		    break;
		case "KeyZ" :
			// only enable undo/redo key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
					if (e.shiftKey) {
						// ctrl/meta + shift + Z: redo
						doRedo();
					} else {
						// ctrl/meta + Z: undo
						doUndo();
					}
				    e.preventDefault();
				}
			}
			break;
		case "KeyY" :
			// only enable undo/redo key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
					// ctrl/meta + Y: redo
					doRedo();
				    e.preventDefault();
				}
			}
		    break;
		case "KeyC" :
			// only enable copy key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    copySelectedRooms();
				    e.preventDefault();
				}
            }
		    break;
		case "KeyX" :
			// only enable cut shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    cutSelectedRooms();
				    e.preventDefault();
				}
            }
		    break;
		case "KeyV" :
			// only enable paste key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    pasteCopiedRooms();
				    e.preventDefault();
				}
            }
		    break;
		case "KeyA" :
			// only enable select all key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    if (e.shiftKey) {
                        selectAllRoomsLikeReallyAllOfThem();
				    } else {
                        selectAllRoomsOnFloor();
				    }
				    e.preventDefault();
				}
            }
		    break;
	}
}

function keyUp(e) {
    e = e || window.event;
    switch (e.code) {
		case "ShiftLeft" :
		case "ShiftRight" :
		    // letting up on the shift key disables multiselect mode
		    setMultiselectEnabled(false);
		    // also disables snapping in the color picker and while dragging rooms
            snapDisabled = false;
            break;
		case "ControlLeft" :
		case "ControlRight" :
		case "MetaLeft" :
		case "MetaRight" :
		    multifloorEnabled = false;
		    if (multiselectEnabled) {
    		    setMultiselectEnabled(true);
                e.preventDefault();
		    }
		    break;
	}
}

//==============================================================
// multiselect
//==============================================================

// multiselect state
var multiselectBox = null;
var multiselectRooms = [];

function showMultiselectBox() {
    if (multiselectBox == null) {
        // create the multiselect box, it's just a heavily css-ed <div>
        multiselectBox = document.createElement("div");
        multiselectBox.className = "multiselectBox";
        multiselectBox.style.position = "absolute";
        // update initial box position
        updateMultiselectBox(lastMTEvent);
        // add to the usual container
        getRoomNoTransformContainer().appendChild(multiselectBox);
    }
}

function hideMultiselectBox() {
    if (multiselectBox != null) {
        // remove and delete the box
		multiselectBox.remove();
		multiselectBox = null;
    }
}

function updateMultiselectBox(e) {
    // normalize the min and max x and y coordinates
    var x1 = Math.min(mouseDownTargetStartPX, multiselectCornerPX);
    var x2 = Math.max(mouseDownTargetStartPX, multiselectCornerPX);
    var y1 = Math.min(mouseDownTargetStartPY, multiselectCornerPY);
    var y2 = Math.max(mouseDownTargetStartPY, multiselectCornerPY);

    // set the box position and size
	multiselectBox.style.left = x1;
	multiselectBox.style.top = y1;
	multiselectBox.style.width = (x2 - x1);
	multiselectBox.style.height = (y2 - y1);

    // convert to model coordinates
    var mx1 = Math.round((x1 - viewPX) / viewScale);
    var my1 = Math.round((y1- viewPY) / viewScale);
    var mx2 = Math.round((x2 - viewPX) / viewScale);
    var my2 = Math.round((y2- viewPY) / viewScale);
    // see what rooms are selected
    updateMultiselectRooms(mx1, my1, mx2, my2, e && e.ctrlKey);
}

function updateMultiselectRooms(mx1, my1, mx2, my2, ctrlKey) {
    // create a bounds object representing the selection area
    var bounds = [{
        x1: mx1,
        y1: my1,
        z1: ctrlKey ? -100000 : (viewFloor * roomMetadata.general.floor_distance),
        x2: mx2,
        y2: my2,
        z2: ctrlKey ? 100000 : (viewFloor * roomMetadata.general.floor_distance) + 1
    }];

    // iterate over the global room list
    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];

        // skip rooms on other floors or ones that are already selected
        if ((!ctrlKey && !room.getFloors().includes(viewFloor)) || selectedRooms.includes(room)) {
            continue;
        }

        // find collisions
        var cols = findCollisions(bounds, room.bounds, 0, false);
        // check if there are collisions and the room is not currently in the multiselection list
        if (cols.length > 0 && !multiselectRooms.includes(room)) {
            // add to teh list
            multiselectRooms.push(room);
            // update the room's visual state
            room.select();

        // check if there are no collisions and the room is currently in the multiselection list
        } else if (cols.length == 0 && multiselectRooms.includes(room)) {
            // remove from the list
            removeFromList(multiselectRooms, room);
            // update the room's visual state
            room.deselect();
        }
    }
}

function commitMultiselectRooms() {
    // check if anything was multiselected
    if (multiselectRooms.length > 0) {
        // the multiselect rooms should be be disjoint from the currently
        // selected rooms, so we can just concat them
        var newSelectedRooms = selectedRooms.concat(multiselectRooms)
        // update the selection
        selectRooms(newSelectedRooms);
        // clear multiselect state
        multiselectRooms = [];
    }
}

function cancelMultiselectRooms() {
    // check if anything was multiselected
    if (multiselectRooms.length > 0) {
        // update the visual state oof each room, there's nothing else we need to do
        for (var r = 0; r < multiselectRooms.length; r++) {
            multiselectRooms[r].deselect();
        }
        // clear multiselect state
        multiselectRooms = [];
    }
}

//==============================================================
// window size and auto-scroll handling
//==============================================================

// How wide the auto-scroll zone is compared to the smallest dimension of the window
var autoScrollAreaRatio = 0.05;
// How often to auto-scroll
var autoScrollsPerSecond = 30;
// Multiplied by the auto-scroll zone width to determine the max amount to scroll in one second
var mouseAutoScrollSpeedFactor = 10.0/autoScrollsPerSecond;
// bump up the speed on a touch screen because it's harder to actually reach the edge of the window
var touchAutoScrollSpeedFactor = 20.0/autoScrollsPerSecond;

var autoScrollTime = 1000.0/autoScrollsPerSecond;

var windowWidth;
var windowHeight;
var autoScrollSize;
var autoScrollDebugElement = null;

// preserve the auto-scroll event so we can re-run the drag logic to move whatever it is we're dragging while auto-scrolling
var autoScrollEvent;
var autoScrollTimeout;
var autoScrollXAmount;
var autoScrollYAmount;

function windowSizeChanged(h, w) {
	windowHeight = h;
	windowWidth = w;
	// re-calculate the width of the auto-scroll zone
	autoScrollSize = Math.max(windowWidth, windowHeight) * autoScrollAreaRatio;

	if (debugEnabled) {
	    updateAutoScrollDebug();
	}
}

function checkAutoScroll(e) {
	// calculate the amount of x-direction auto-scroll, if any
	// amount goes from -1 at the left window boundary, to 0 at the left auto-scroll zone boundary,
	// to 0 at the right auto-scroll zone boundary, to 1 at the right window boundary
	var x = e.clientX;
	var dx;
	if (x < autoScrollSize) {
		dx = Math.max(-1 + (x / autoScrollSize), -1);
	} else if (x > (windowWidth - autoScrollSize)) {
		dx = Math.min(1 + ((x - windowWidth) / autoScrollSize), 1);
	} else {
		dx = 0;
	}
	
	// calculate the amount of y-direction auto-scroll, if any
	// amount works the same as the x-direction
	var y = e.clientY;
	var dy;
	if (y < autoScrollSize) {
		dy = Math.max(-1 + (y / autoScrollSize), -1);
	} else if (y > (windowHeight - autoScrollSize)) {
		dy = Math.min(1 + ((y - windowHeight) / autoScrollSize), 1);
	} else {
		dy = 0;
	}

	// refresh auto-scroll state
	setAutoScroll(e, dx, dy);
}

function setAutoScroll(e, xAmount, yAmount) {
	/// save the amounts
	autoScrollXAmount = xAmount;
	autoScrollYAmount = yAmount;

	if (xAmount == 0 && yAmount == 0) {
		// turn off scrolling if there is no auto-scroll
		if (autoScrollTimeout) {
			clearTimeout(autoScrollTimeout);
			autoScrollTimeout = null;
		}
		autoScrollEvent = null;

	} else {
		// save the event so we can repeat the dragEvent() call
		autoScrollEvent = e;
		// make sure scrolling is turned on
		if (!autoScrollTimeout) {
			autoScrollTimeout = setTimeout(doAutoScroll, autoScrollTime);
		}
	}
}

function doAutoScroll() {
	// sanity check
	if (!autoScrollTimeout) {
		return;
	}

	// calculate the change in x and y
	var speedFactor = autoScrollSize * (autoScrollEvent.isTouch ? touchAutoScrollSpeedFactor : mouseAutoScrollSpeedFactor);
	var dx = autoScrollXAmount * speedFactor;
	var dy = autoScrollYAmount * speedFactor;

	// scroll the view point opposite to the auto-scroll direction
	setViewP(viewPX - dx, viewPY - dy, viewScale);
	// offset the drag start point opposite to the auto-scroll direction
	mouseDownTargetStartPX -= dx;
	mouseDownTargetStartPY -= dy;

	// repeat the dragEvent handling to move whatever we're dragging
	dragEvent(autoScrollEvent);

	// repeat
	autoScrollTimeout = setTimeout(doAutoScroll, autoScrollTime);
}

function enableAutoScrollDebug(enabled) {
	if (enabled) {
		if (!autoScrollDebugElement) {
	        autoScrollDebugElement = document.createElement("div");
	        autoScrollDebugElement.className = "debugDoorBounds";
			autoScrollDebugElement.style.position = "absolute";
			updateAutoScrollDebug();
			getRoomNoTransformContainer().appendChild(autoScrollDebugElement);
		}
	} else if (autoScrollDebugElement) {
		autoScrollDebugElement.remove();
		autoScrollDebugElement = null;
	}
}

function updateAutoScrollDebug() {
	autoScrollDebugElement.style.left = autoScrollSize;
	autoScrollDebugElement.style.top = autoScrollSize;
	autoScrollDebugElement.style.width = windowWidth - (autoScrollSize * 2);
	autoScrollDebugElement.style.height = windowHeight - (autoScrollSize * 2);
}


var originDebugElement = null;

function enableOriginDebug(enabled) {
	if (enabled) {
		if (!originDebugElement) {
	        originDebugElement = document.createElement("div");
	        originDebugElement.className = "debug-origin";
			updateAutoScrollDebug();
			getRoomContainer().appendChild(originDebugElement);
		}
	} else if (originDebugElement) {
		originDebugElement.remove();
		originDebugElement = null;
	}
}
