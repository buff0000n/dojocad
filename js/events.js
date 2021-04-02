//==============================================================
// wrapper for handling both mouse and touch events
//==============================================================

class MTEvent {
	constructor(isTouch, currentTarget, clientX, clientY, altKey, shiftKey) {
		this.isTouch = isTouch;
		this.currentTarget = currentTarget;
		this.clientX = clientX;
		this.clientY = clientY;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
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

var lastMouseEvent = null;

function mouseEventToMTEvent(e) {
	lastMouseEvent = e;
	return new MTEvent(false, e.currentTarget, e.clientX, e.clientY, e.altKey, e.shiftKey);
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
var multiselectCornerPX = null;
var multiselectCornerPY = null;

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
	        mouseDownTarget = e.currentTarget;

        } else {
            if (e.altKey) {
                // insta-delete

                if (!selectedRooms.includes(e.currentTarget.room)) {
                    selectRoom(e.currentTarget.room, false, false);
                }

                deleteSelectedRooms();

            } else {
                mouseDownTarget = e.currentTarget;
                mouseDownTarget.room.setClickPoint(mouseDownTargetStartPX, mouseDownTargetStartPY);
                if (selectedRooms.includes(mouseDownTarget.room)) {
                    for (var r = 0; r < selectedRooms.length; r++) {
                        selectedRooms[r].setClickPoint(mouseDownTargetStartPX, mouseDownTargetStartPY);
                    }
                }
                newRoom = false;
            }
        }
    }

	startDrag();
}

function startNewRoomDrag(e, rooms, target) {
    mouseDownTarget = target;
    startUndoCombo();
    selectRooms([], false, true);
    selectRooms(rooms, false, false);

    for (var r = 0; r < rooms.length; r++) {
        rooms[r].setClickPoint(e.clientX, e.clientY);
    }

    newRoom = true;

	startDrag();
	// force the room to start under the cursor
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
    return mouseDownTarget && mouseDownTarget.room && selectedRooms.includes(mouseDownTarget.room) && !multiselectEnabled;
}

function isMultiselecting() {
    return multiselectCornerPX != null;
}

function dragEvent(e) {
    // calculate the new cursor position:
    var offsetPX = e.clientX - mouseDownTargetStartPX;
    var offsetPY = e.clientY - mouseDownTargetStartPY;

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
        handleRoomDrag(offsetM, clickM, e.shiftKey, dragged);

        // todo: necessary?
	    for (var r = 0; r < selectedRooms.length; r++) {
    	    selectedRooms[r].updateView();
        }

	    checkAutoScroll(e);

    } else if (multiselectEnabled) {
        if (!isMultiselecting()) {
            mouseDownTargetStartPX = e.clientX;
            mouseDownTargetStartPY = e.clientY;
            multiselectCornerPX = e.clientX;
            multiselectCornerPY = e.clientY;
    	    showMultiselectBox();

        } else {
            multiselectCornerPX = e.clientX;
            multiselectCornerPY = e.clientY;
    	    updateMultiselectBox();
    	    checkAutoScroll(e);
        }

    } else {
		mouseDownTarget = null;
	    mouseDownTargetStartPX = e.clientX;
	    mouseDownTargetStartPY = e.clientY;

		setViewP(viewPX + offsetPX, viewPY + offsetPY, viewScale);
    }

    dragged = true;
}

function handleRoomDrag(offsetM, clickM, shiftKey) {
    // track the best door pair for snapping
    var snapDoor = null;
    var snapOtherDoor = null;

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
    } else if (shiftKey) {
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
        if (isMultiselecting()) {
            hideMultiselectBox();
            multiselectCornerPX = null;
            multiselectCornerPY = null;
            dragged = false;
            commitMultiselectRooms();

        } else {
			selectRoom(!mouseDownTarget ? null : mouseDownTarget.room, undoable = true, true);
        }

    } else if (isDraggingRoom()) {
        // save the clicked room, if any
        lastClickedRoom = (mouseDownTarget && mouseDownTarget.room) ? mouseDownTarget.room : null;
	    mouseDownTarget = null;
	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;

		if (dragged) {
    	    for (var r = 0; r < selectedRooms.length; r++) {
                selectedRooms[r].dropDragOffset();
                selectedRooms[r].updateView();
    	        selectedRooms[r].ignoreRooms = null;
            }
            dragged = false;

            hideDoorMarkers();

            if (!dragMoveUndoAction) {
                addUndoAction(new AddDeleteRoomsAction(selectedRooms, true));

            } else if (dragMoveUndoAction.isAMove()) {
                addUndoAction(dragMoveUndoAction);
            }

            endAllUndoCombos();

            dragMoveUndoAction = null;

    		movedSelectedRoom();

		} else {
			doRoomMenu(e, selectedRooms);
		}


	} else {
		if (!dragged) {
			selectRoom(!mouseDownTarget ? null : mouseDownTarget.room, undoable = true, false);
		}

	    mouseDownTargetStartPX = 0;
	    mouseDownTargetStartPY = 0;
	    dragged = false;
	}

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    mouseDownTarget = null;
    // stop auto-scrolling
    setAutoScroll(e, 0, 0)
}

function selectRoom(room, undoable = false, multiselect = false) {
    var oldSelectedRooms = selectedRooms;

    if (!multiselect) {
        if (selectedRooms.includes(room)) {
            return;
        }

        if (oldSelectedRooms.length > 0) {
            for (var r = 0; r < oldSelectedRooms.length; r++) {
                oldSelectedRooms[r].deselect();
                oldSelectedRooms[r].updateView();
            }
        }
        if (room) {
            if (!room.isOnFloor()) {
                setViewP(viewPX, viewPY, viewScale, room.floor);
            }

            selectedRooms = [room];
            room.select();
            room.updateView();
        } else if (oldSelectedRooms.length > 0) {
            // only reset selectedRooms if it wasn't already empty
            selectedRooms = [];
        }

    // selecting nothing while multiselect is active does nothing
    } else if (room) { // multiselect
        if (selectedRooms.includes(room)) {
            // selecting a room again will deselect it
            var newRooms = oldSelectedRooms.slice();
            removeFromList(newRooms, room);
            selectedRooms = newRooms;
            room.deselect();
            room.updateView();

        } else {
            // multiselecting new room
            var newRooms = oldSelectedRooms.slice();
            newRooms.push(room);
            selectedRooms = newRooms;
            room.select();
            room.updateView();
        }
    }

    if (undoable && oldSelectedRooms != selectedRooms) {
        addUndoAction(new SelectionAction(oldSelectedRooms, selectedRooms));
    }
}

function selectRooms(rooms, append=false, undoable=true) {
    var oldSelectedRooms = selectedRooms;
    var newSelectedRooms = selectedRooms.slice();
    var selectionChanged = false;

    if (!append) {
        for (var r = 0; r < oldSelectedRooms.length; r++) {
            if (!rooms.includes(oldSelectedRooms[r])) {
                oldSelectedRooms[r].deselect();
                oldSelectedRooms[r].updateView();
                removeFromList(newSelectedRooms, oldSelectedRooms[r]);
                selectionChanged = true;
            }
        }
    }

    if (rooms) {
        for (var r = 0; r < rooms.length; r++) {
            if (!oldSelectedRooms.includes(rooms[r])) {
                rooms[r].select();
                rooms[r].updateView();
                newSelectedRooms.push(rooms[r]);
                selectionChanged = true;
            }
        }
    }

    if (selectionChanged) {
        if (undoable) {
            addUndoAction(new SelectionAction(oldSelectedRooms, newSelectedRooms));
        }
        selectedRooms = newSelectedRooms;
    }
}

function selectAllRoomsOnFloor() {
    var floorRooms = [];

    for (var r = 0; r < roomList.length; r++) {
        if (roomList[r].getFloors().includes(viewFloor)) {
            floorRooms.push(roomList[r]);
        }
    }

    selectRooms(floorRooms, false, true);
}

function cancelRoomDrag() {
    if (isDraggingRoom()) {
        mouseDownTarget = null;
        mouseDownTargetStartPX = 0;
        mouseDownTargetStartPY = 0;
		if (newRoom) {
			// no undo action
		    for (var r = 0; r < selectedRooms.length; r++) {
    			removeRoom(selectedRooms[r]);
            }
		    selectedRooms = [];

		} else {
		    for (var r = 0; r < selectedRooms.length; r++) {
                selectedRooms[r].resetDragOffset();
                selectedRooms[r].dropDragOffset();
                selectedRooms[r].updateView();
		    }
		}

	    mouseDownTarget = null;
	    dragged = false;
        hideDoorMarkers();

	    document.onmouseup = null;
	    document.onmousemove = null;
	    document.ontouchend = null;
	    document.ontouchmove = null;

        cancelAllUndoCombos();
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
		updateMultiselectBox();

	} else if (mouseDownTarget) {
		// Oh double god we're dragging and zooming at the same time *nosebleed*
		mouseDownTargetStartPX = (mouseDownTargetStartPX - viewPX) * (newViewScale / viewScale) + newViewPX;
		mouseDownTargetStartPY = (mouseDownTargetStartPY - viewPY) * (newViewScale / viewScale) + newViewPY;
	}

	setViewP(newViewPX, newViewPY, newViewScale);
}

//==============================================================
// multiselect state handling
//==============================================================

function doToggleMultiselect() {
    setMultiselectEnabled(!multiselectEnabled);
}

function setMultiselectEnabled(enabled) {
    var button = document.getElementById("multiselectButton")
    if (enabled) {
        multiselectEnabled = true;
        button.className = "button";
		button.children[0].title = "Disable Multiselect Mode";

    } else {
        multiselectEnabled = false;
        button.className = "button-disabled";
		button.children[0].title = "Enable Multiselect Mode";

		if (isMultiselecting()) {
            mouseDownTargetStartPX = multiselectCornerPX;
            mouseDownTargetStartPY = multiselectCornerPY
            multiselectCornerPX = null;
            multiselectCornerPY = null;
            hideMultiselectBox();
		}
    }
}

//==============================================================
// key event handling
//==============================================================

function nothingElseGoingOn() {
    return getCurrentMenuLevel() == 0 && !isDraggingRoom() && !isMultiselecting();
}

function keyDown(e) {
    e = e || window.event;

    nodeName = e.target.nodeName;

    // ignote typing in a text box
    if (nodeName == "TEXTAREA" || nodeName == "INPUT") {
        return;
    }

    switch (e.code) {
		case "Escape" :
		    clearMenus(0);
		    cancelRoomDrag();
            e.preventDefault();
		    break;
		case "Backspace" :
		case "Delete" :
			if (!isDraggingRoom() && !isMultiselecting()) {
    			deleteSelectedRooms();
                e.preventDefault();
            }
		    break;
		case "ArrowUp" :
			if (!isDraggingRoom() && !isMultiselecting()) {
                doFloorUp();
                e.preventDefault();
            }
		    break;
		case "ArrowDown" :
			if (!isDraggingRoom() && !isMultiselecting()) {
                doFloorDown();
                e.preventDefault();
            }
		    break;
		case "KeyD" :
			if (nothingElseGoingOn()) {
    			duplicateSelectedRooms(lastMouseEvent);
                e.preventDefault();
            }
		    break;
		case "KeyR" :
		    // still allow ctrl-R to work normally
		    if (!e.ctrlKey && !e.metaKey && !isMultiselecting()) {
    			rotateSelectedRoom(lastMouseEvent);
                e.preventDefault();
		    }
		    break;
		case "ShiftLeft" :
		case "ShiftRight" :
		    if (!isDraggingRoom()) {
    		    setMultiselectEnabled(true);
                e.preventDefault();
		    }
		    // drag snapping is taken care of elsewhere
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
			// only enable select all key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    copySelectedRooms();
				    e.preventDefault();
				}
            }
		    break;
		case "KeyX" :
			// only enable select all key shortcut if there is no menu visible and no dragging operation
			if (nothingElseGoingOn()) {
				// ctrlKey on Windows, metaKey on Mac
				if (e.ctrlKey || e.metaKey) {
				    cutSelectedRooms();
				    e.preventDefault();
				}
            }
		    break;
		case "KeyV" :
			// only enable select all key shortcut if there is no menu visible and no dragging operation
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
                    selectAllRoomsOnFloor();
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
		    setMultiselectEnabled(false);
	}
}

//==============================================================
// multiselect
//==============================================================

var multiselectBox = null;
var multiselectRooms = [];

function showMultiselectBox() {
    if (multiselectBox == null) {
        multiselectBox = document.createElement("div");
        multiselectBox.className = "multiselectBox";
        multiselectBox.style.position = "absolute";
        updateMultiselectBox();
        getRoomContainer().appendChild(multiselectBox);
    }
}

function hideMultiselectBox() {
    if (multiselectBox != null) {
		multiselectBox.remove();
		multiselectBox = null;
    }
}

function updateMultiselectBox() {
    var x1 = Math.min(mouseDownTargetStartPX, multiselectCornerPX);
    var x2 = Math.max(mouseDownTargetStartPX, multiselectCornerPX);
    var y1 = Math.min(mouseDownTargetStartPY, multiselectCornerPY);
    var y2 = Math.max(mouseDownTargetStartPY, multiselectCornerPY);

	multiselectBox.style.left = x1;
	multiselectBox.style.top = y1;
	multiselectBox.style.width = (x2 - x1);
	multiselectBox.style.height = (y2 - y1);

    var mx1 = Math.round((x1 - viewPX) / viewScale);
    var my1 = Math.round((y1- viewPY) / viewScale);
    var mx2 = Math.round((x2 - viewPX) / viewScale);
    var my2 = Math.round((y2- viewPY) / viewScale);
    updateMultiselectRooms(mx1, my1, mx2, my2);
}

function updateMultiselectRooms(mx1, my1, mx2, my2) {
    var bounds = [{
        x1: mx1,
        y1: my1,
        z1: (viewFloor * roomMetadata.general.floor_distance),
        x2: mx2,
        y2: my2,
        z2: (viewFloor * roomMetadata.general.floor_distance) + 1
    }];

    // iterate over the global room list
    for (var r = 0; r < roomList.length; r++) {
        var room = roomList[r];

        // skip rooms on other floors or ones that are already selected
        if (!room.getFloors().includes(viewFloor) || selectedRooms.includes(room)) {
            continue;
        }

        // find collisions
        var cols = findCollisions(bounds, room.bounds);
        if (cols.length > 0 && !multiselectRooms.includes(room)) {
            multiselectRooms.push(room);
            room.select();

        } else if (cols.length == 0 && multiselectRooms.includes(room)) {
            removeFromList(multiselectRooms, room);
            room.deselect();
        }
    }
}

function commitMultiselectRooms() {
    if (multiselectRooms.length > 0) {
        var newSelectedRooms = selectedRooms.concat(multiselectRooms)
        selectRooms(newSelectedRooms);
        multiselectRooms = [];
    }
}

function cancelMultiselectRooms() {
    if (multiselectRooms.length > 0) {
        for (var r = 0; r < multiselectRooms.length; r++) {
            multiselectRooms[r].deselect();
        }
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
			getRoomContainer().appendChild(autoScrollDebugElement);
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