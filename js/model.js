// Sorry, this is Grade-A Fancy spaghetti code

class Bound {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;
        this.invisible = "true" == doorMetadata.invis;
        this.debugBorder = null;

        this.collisions = Array();
    }

    updatePosition() {
        // rotate the bound corners and translate by the room position
        var rotation = this.room.rotation;
        var mv1 = new Vect(this.metadata.x1, this.metadata.y1).rotate(rotation).add(this.room.mv).add(this.room.mdragOffset);
        var mv2 = new Vect(this.metadata.x2, this.metadata.y2).rotate(rotation).add(this.room.mv).add(this.room.mdragOffset);

        // calculate the min and max X and Y coords
        this.x1 = mv1.x < mv2.x ? mv1.x : mv2.x;
        this.x2 = mv1.x > mv2.x ? mv1.x : mv2.x;
        this.y1 = mv1.y < mv2.y ? mv1.y : mv2.y;
        this.y2 = mv1.y > mv2.y ? mv1.y : mv2.y;
        // calcuate the floor and ceiling Z coordinates relative to the room's floor
        this.z1 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.floor;
        this.z2 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.ceil;
    }
    
	setDebug(debug) {
		if (debug) {
	        this.debugBorder = document.createElement("div");
	        this.debugBorder.className = "debugBounds";
			this.debugBorder.style.position = "absolute";
	        if (this.room.isVisible()) {
				getRoomContainer().appendChild(this.debugBorder);
			}
		} else {
			this.debugBorder.remove();
			this.debugBorder = null;
		}
	}

	addCollision(otherBound) {
		if (addToListIfNotPresent(this.collisions, otherBound)) {
			otherBound.addCollision(this);
			if (this.collisions.length == 1) {
				this.lastFloor = this.room.floor;
				addFloorError(this.room.floor, this);
				if (this.debugBorder) {
					this.debugBorder.className = "debugOverlapBounds";
				}
			}
		}
	}

	removeCollision(otherBound) {
		if (removeFromList(this.collisions, otherBound)) {
			otherBound.removeCollision(this);
			if (this.collisions.length == 0) {
				removeFloorError(this.lastFloor ? this.lastFloor : this.room.floor, this);
				this.lastFloor = null;
				if (this.debugBorder) {
					this.debugBorder.className = "debugBounds";
				}
			}
		}
	}

	clearCollisions() {
		while (this.collisions.length > 0) {
			this.removeCollision(this.collisions[this.collisions.length - 1]);
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder && this.room.isVisible()) {
            viewContainer.appendChild(this.debugBorder);
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = (this.x1 * viewScale) + viewPX;
			this.debugBorder.style.top = (this.y1 * viewScale) + viewPY;
			this.debugBorder.style.width = (this.x2 - this.x1) * viewScale;
			this.debugBorder.style.height = (this.y2 - this.y1) * viewScale;
        }
    }

    removeDisplay() {
        if (this.debugBorder) {
            this.debugBorder.remove();
        }
    }
}

class Door {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;
        this.metadataRotation = new Vect(this.metadata.outx, this.metadata.outy).toRotation();
        this.debugBorder = null;

        this.collisions = Array();

        this.otherDoor = null;
        this.incoming = false;
        this.crossBranch = false;
    }

    updatePosition() {
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate(this.room.rotation).add(this.room.mv).add(this.room.mdragOffset);;
        this.outv = new Vect(this.metadata.outx, this.metadata.outy).rotate(this.room.rotation);
        this.rotation = this.outv.toRotation();
        this.floor = this.room.floor + this.metadata.floor;
        
        var width = doorSnapPixels / viewScale;

        this.x1 = this.mv.x - width;
        this.x2 = this.mv.x + width;
        this.y1 = this.mv.y - width;
        this.y2 = this.mv.y + width;
        this.z1 = this.floor * roomMetadata.general.floor_distance;
        this.z2 = this.z1 + 1;
    }

	setDebug(debug) {
		if (debug) {
	        this.debugBorder = document.createElement("div");
	        this.debugBorder.className = this.collisions.length ==  0 ? "debugDoorBounds" : "debugOverlapDoorBounds";
			this.debugBorder.style.position = "absolute";
			if (!this.otherDoor && viewFloor == this.floor) {
				getRoomContainer().appendChild(this.debugBorder);
			}
		} else {
			this.debugBorder.remove();
			this.debugBorder = null;
		}
	}

	addCollision(otherDoor) {
		if (addToListIfNotPresent(this.collisions, otherDoor)) {
			otherDoor.addCollision(this);
			if (this.debugBorder && this.collisions.length == 1) {
				this.debugBorder.className = "debugOverlapDoorBounds";
			}
		}
	}

	removeCollision(otherDoor) {
		if (removeFromList(this.collisions, otherDoor)) {
			otherDoor.removeCollision(this);
			if (this.debugBorder && this.collisions.length == 0) {
				this.debugBorder.className = "debugDoorBounds";
			}
		}
	}

	clearCollisions() {
		while (this.collisions.length > 0) {
			this.removeCollision(this.collisions[this.collisions.length - 1]);
		}
	}

	autoConnect() {
		if (this.otherDoor) {
			return;
		}
		for (var c = 0; c < this.collisions.length; c++) {
			var otherDoor = this.collisions[c];
			if (otherDoor.mv.equals(this.mv)) {
				this.connect(otherDoor)
			}
		}
	}

	connect(otherDoor, crossBranch = true, incoming = false) {
		if (this.otherDoor == otherDoor) {
			return;
		}

		if (this.otherdoor) {
			this.disconnectFrom(prevOtherDoor);
		}

		this.otherDoor = otherDoor;
		this.crossBranch = crossBranch;
		this.incoming = incoming;
		this.otherDoor.connect(this, crossBranch, !incoming);

		if (this.debugBorder) {
			this.removeDisplay();
		}

		this.room.doorConnected(this);
	}

	disconnectFrom(otherDoor) {
		if (this.otherDoor != otherDoor) {
			return;
		}

		// important to do this first
		this.otherDoor = null;
		otherDoor.disconnectFrom(this);

		this.removeCollision(otherDoor);

        if (this.debugBorder && this.room.isVisible()) {
			getRoomContainer().appendChild(this.debugBorder);
		}
		this.room.doorDisconnected(this);
	}

	disconnect() {
		if (!this.otherDoor) {
			return null;
		}
		var save = [this, this.otherDoor, this.crossBranch, this.incoming];
		this.disconnectFrom(this.otherDoor);
		return save;
	}

	reconnect(save) {
		if (save[0] == this) {
			this.connect(save[1], save[2], save[3]);
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder && this.room.isVisible() && !this.otherDoor && this.floor == viewFloor) {
            viewContainer.appendChild(this.debugBorder);
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = (this.x1 * viewScale) + viewPX;
			this.debugBorder.style.top = (this.y1 * viewScale) + viewPY;
			this.debugBorder.style.width = (this.x2 - this.x1) * viewScale;
			this.debugBorder.style.height = (this.y2 - this.y1) * viewScale;
        }
    }

    removeDisplay() {
        if (this.debugBorder) {
            this.debugBorder.remove();
        }
    }
}


function roomToString(room) {
    return room.metadata.id + "," + room.mv.x + "," + room.mv.y + "," + room.floor + "," + (room.rotation / 90)
}

function roomFromString(string) {
    var s = string.split(",");
    var room = new Room(getRoomMetadata(s[0]));
    // room coordinates may be fractional because of old dojo rooms, floor and rotation are still ints
    room.setPosition(parseFloat(s[1]), parseFloat(s[2]), parseInt(s[3]), parseInt(s[4]) * 90);
    return room;
}

var roomIdCount = 0;

class Room {
    constructor(metadata) {
        this.metadata = metadata;
        this.id = "room" + (roomIdCount++);

        this.bounds = Array();
        for (var i = 0; i < this.metadata.bounds.length; i++) {
            this.bounds.push(new Bound(this, this.metadata.bounds[i]));
        }
        this.doors = Array();
        for (var i = 0; i < this.metadata.doors.length; i++) {
            this.doors.push(new Door(this, this.metadata.doors[i]));
        }
        this.angleToDoors = Array();

        this.multifloor = this.metadata.floor_images != null;
        this.floor = null;

		this.viewContainer = null;
        this.display = null;
        this.outline = null;
        this.grid = null;
        this.marker = null;
        this.selected = false;

        this.mdragOffset = new Vect(0, 0);
        this.dragging = false;

        this.calculateAnchor();
        this.ruleErrors = Array();
    }

	addRuleError(rule) {
		if (addToListIfNotPresent(this.ruleErrors, rule) && this.ruleErrors.length == 1) {
			addFloorError(this.floor, this);
			this.checkErrors();
			this.updateView();
		}
	}

	removeRuleError(rule) {
		if (removeFromList(this.ruleErrors, rule) && this.ruleErrors.length == 0) {
			removeFloorError(this.floor, this);
			this.checkErrors();
			this.updateView();
		}
	}

	removeAllRuleErrors() {
		if (this.ruleErrors.length > 0) {
			removeFloorError(this.floor, this);
			this.checkErrors();
			this.updateView();
		}
	}

	reAddAllRuleErrors() {
		if (this.ruleErrors.length > 0) {
			addFloorError(this.floor, this);
			this.checkErrors();
			this.updateView();
		}
	}

    getAllErrors() {
		var collidedRooms = this.getAllCollidedRooms();
		var errors = this.ruleErrors;
		if (collidedRooms.length > 0) {
			var errors2 = Array();
			if (errors) {
				for (var e = 0; e < errors.length; e++) {
					errors2.push(errors[e]);
				}
			}
			for (var r = 0; r  < collidedRooms.length; r++) {
				errors2.push(collidedRooms[r].metadata.name + " collision");
			}
			errors = errors2;
		}
		return (errors && errors.length > 0) ? errors : null;
    }

	dispose() {
		this.removeAllRuleErrors();
	}

    isVisible(whichFloor = null) {
        if (whichFloor == null) {
            whichFloor = viewFloor;
        }
        if (this.floor == whichFloor) {
            return true;
        }
        if (!this.multifloor) {
            return false;
        }
		var displayFloor = whichFloor - this.floor;
		for (var i = 0; i < this.metadata.floor_images.length; i++) {
			if (this.metadata.floor_images[i].floor == displayFloor) {
				return true;
			}
		}
		return false;
    }

    getFloors() {
        if (!this.multifloor) {
            return [this.floor];
        }
        // get the floor list from the doors.  The image list may contain extra floor images that we don't want to
        // include unless there's something else on that floor.  It's the Dry Dock, I'm talking about the Dry Dock.
        var floors = Array();
		for (var d = 0 ; d < this.doors.length; d++) {
			addToListIfNotPresent(floors, this.doors[d].floor);
		}
		return floors;
    }

    setDebug(debug) {
        for (var i = 0; i < this.doors.length; i++) {
            this.doors[i].setDebug(debug);
        }
        for (var i = 0; i < this.bounds.length; i++) {
            this.bounds[i].setDebug(debug);
        }
    }

    setPosition(nmx, nmy, nf, nr) {
        var isNewFloor =  nf != this.floor;
        if (isNewFloor) {
			this.removeAllRuleErrors();
        }
        this.mv = new Vect(nmx, nmy);
        this.floor = nf;
        this.rotation = nr;

		if (isNewFloor) {
			this.removeDisplay();
			this.addDisplay(getRoomContainer());
			this.reAddAllRuleErrors();
		}
		this.updateDoorPositions();
		this.updateBoundsPositions();
    }

    setFloor(floor) {
        this.setPosition(this.mv.x, this.mv.y, floor, this.rotation);
    }

    setPositionAndConnectDoors(nmx, nmy, nf, nr) {
        this.setPosition(nmx, nmy, nf, nr);
        // connect doors
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].autoConnect();
        }
        // clear any saved door connections
		this.doorConnectionSaves = null;

		// recalc bounds
		this.updateBoundsPositions();
    }

    resetPositionAndConnectDoors() {
        this.setPositionAndConnectDoors(this.mv.x, this.mv.y, this.floor, this.rotation);
    }

	updatePosition() {
		// for a pure view update, just worry about doors because their snap bounds depend on the zoon
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].updatePosition();
        }
	}

    updateDoorPositions() {
        // clear the angle-to-door mapping
        this.angleToDoors = Array();
        // update door positions
        for (var d = 0; d < this.doors.length; d++) {
            var door = this.doors[d];

            door.updatePosition();

            // clear the door's collisions
            door.clearCollisions();

			if (!door.otherDoor) {
	            // re-build the angle-to-door mapping
	            var index = door.rotation/90;
	            if (!this.angleToDoors[index]) {
	                this.angleToDoors[index] = Array();
	            }
	            this.angleToDoors[index].push(door);
			}
        }

		// regenerate door collisions
		// loop over the four possible angles
		for (var a = 0; a < 4; a++) {
			// see if we have any doors facing that angle
			if (this.angleToDoors[a]) {
				// calculate the index of the opposite angle
				var a2 = (a + 2) % 4;
				// iterate over the global room list
				for (var r = 0; r < roomList.length; r++) {
					var room = roomList[r];
					// see if the room isn't this room and has doors facing the other direction
					if (room != this && room.angleToDoors[a2]) {
						// find collisions in the two sets of door boxes
						var cols = findCollisions(this.angleToDoors[a], room.angleToDoors[a2]);
						// iterate over the collisions
						for (var c = 0; c <cols.length; c++) {
							// save the collision state in each door object
							cols[c][0].addCollision(cols[c][1]);
						}
					}
				}
			}
		}
    }

    doorConnected(door) {
        var index = door.rotation/90;
        if (this.angleToDoors[index]) {
            removeFromList(this.angleToDoors[index], door);
        }
    }

    doorDisconnected(door) {
        var index = door.rotation/90;
        if (!this.angleToDoors[index]) {
            this.angleToDoors[index] = Array();
        }
        addToListIfNotPresent(this.angleToDoors[index], door);
    }

    getAllCollidedRooms() {
        // convenience method to collect all the currently detected room collisions
        var collidedRoomList = Array();
        for (var b = 0; b < this.bounds.length; b++) {
            var bound = this.bounds[b];
	        for (var c = 0; c < bound.collisions.length; c++) {
	            addToListIfNotPresent(collidedRoomList, bound.collisions[c].room);
	        }
        }
        return collidedRoomList;
    }

    updateBoundsPositions() {
        // get all the rooms we were collided with before
		var collidedRooms = this.getAllCollidedRooms();

		// update bounds positions
        for (var b = 0; b < this.bounds.length; b++) {
            var bound = this.bounds[b];
            bound.updatePosition();

            // clear the bound's collisions
            bound.clearCollisions();

			// iterate over the global room list
			for (var r = 0; r < roomList.length; r++) {
				var room = roomList[r];
				// see if the room isn't this room
				if (room != this) {
					// find collisions in the two sets of bound boxes
					var cols = findCollisions(this.bounds, room.bounds);
					// iterate over the collisions
					for (var c = 0; c <cols.length; c++) {
						// save the collision state in each bound object
						cols[c][0].addCollision(cols[c][1]);
					}
				}
			}
        }

        // add all the new rooms we are collided with
 		addAllToListIfNotPresent(collidedRooms, this.getAllCollidedRooms());
		for (var r = 0; r < collidedRooms.length; r++) {
			if (collidedRooms[r].checkCollided() | collidedRooms[r].checkErrors()) {
			    collidedRooms[r].updateView();
			}
		}
		this.checkCollided();
	    this.checkErrors();
    }

    checkCollided() {
		var collidedRooms = this.getAllCollidedRooms();
		if (collidedRooms.length > 0) {
			if (this.viewContainer) {
				if (!this.grid) {
			        this.grid = this.addDisplayElement("-bounds-blue.png", 1);
				}
			    this.grid.style.filter = "hue-rotate(120deg) brightness(200%)";
			}
		    return true;

		} else {
			if (this.grid) {
				if (this.isSelected()) {
					if (this.dragging) {
					    this.grid.style.filter = "brightness(200%)";
					} else {
					    this.grid.style.filter = "";
					}

				} else {
					this.grid.remove();
				    this.grid = null;
				}
			}
			return false;
		}
    }

    checkErrors() {
        var errors = this.getAllErrors();
		if (errors) {
			if (this.viewContainer) {
				if (!this.outline) {
			        this.outline = this.addDisplayElement("-line-blue.png", 3);
				}
			    if (this.isSelected()) {
				    this.outline.style.filter = "hue-rotate(120deg) saturate(50%) brightness(250%)";

			    } else if (this.isVisible()) {
				    this.outline.style.filter = "hue-rotate(120deg)";

			    } else {
			        this.outline = this.removeDisplayElement(this.outline);
				    return false;
			    }
			}
		    return true;

		} else if (this.isSelected()) {
			if (!this.outline) {
		        this.outline = this.addDisplayElement("-line-blue.png", 3);
		    }
		    this.outline.style.filter = "";

		} else if (this.outline) {
	        this.outline = this.removeDisplayElement(this.outline);
		}

	    return false;
    }

    calculateAnchor() {
        // hack: set the position to 0,0 and positions the bounds so we can calculate the image anchor points
        this.mv = new Vect(0, 0);
        this.floor = 100;
        this.rotation = 0;
        for (var b = 0; b < this.bounds.length; b++) {
            this.bounds[b].updatePosition();
		}

        // update bounds and calculate overall min X and Y
        var minBoundsMX = this.mv.x;
        var minBoundsMY = this.mv.y;
        for (var i = 0; i < this.bounds.length; i++) {
            if (this.bounds[i].invisible) {
                continue;
            }
            if (this.bounds[i].x1 < minBoundsMX) {
                minBoundsMX = this.bounds[i].x1;
            }
            if (this.bounds[i].y1 < minBoundsMY) {
                minBoundsMY = this.bounds[i].y1;
            }
        }
        // The min X and Y coords are what the image will be anchored to
        this.anchorMX = minBoundsMX - this.mv.x;
        this.anchorMY = minBoundsMY - this.mv.y;
    }

    select() {
        this.selected = true;
        if (!this.outline) {
	        this.outline = this.addDisplayElement("-line-blue.png", 3);
        }
        if (!this.grid) {
	        this.grid = this.addDisplayElement("-bounds-blue.png", 1);
        }
		// see if the outline should be red
	    this.checkCollided();
	    this.checkErrors();
	    // todo: why is this here?
        this.updateView();
    }

    deselect() {
        this.selected = false;
        if (!this.checkErrors()) {
	        this.outline = this.removeDisplayElement(this.outline);
        }
        if (!this.checkCollided()) {
	        this.grid = this.removeDisplayElement(this.grid);
        }
	    // todo: why is this here?
        this.updateView();
    }

    isSelected() {
        return this.selected;
    }

    rotate() {
	    this.disconnectAllDoors();
        this.setPositionAndConnectDoors(this.mv.x, this.mv.y, this.floor, (this.rotation + 90) % 360);
    }
    
    rotateFloor() {
        if (!this.multifloor) {
            return;
        }
	    var currentFloor = viewFloor - this.floor;
	    var isSelected = this.isSelected();

		// find the first available floor above the current floor, and the lowest available floor
	    var nextFloor = 100;
	    var lowestFloor = 100;
		for (var i = 0; i < this.metadata.floor_images.length; i++) {
			var floor = this.metadata.floor_images[i].floor;
			if (floor > currentFloor && floor < nextFloor) {
				nextFloor = floor;
			}
			if (floor < lowestFloor) {
				lowestFloor = floor;
			}
		}

		var newFloor;
		// if we have a next floor then
		if (nextFloor != 100) {
			newFloor = viewFloor - nextFloor;
		} else {
			newFloor = viewFloor - lowestFloor;
		}

	    this.disconnectAllDoors();
        this.setPositionAndConnectDoors(this.mv.x, this.mv.y, newFloor, this.rotation);
        if (isSelected) {
            this.select();
        }
    }

    setClickPoint(clickPX, clickPY) {
        this.clickP = new Vect(((clickPX - viewPX) / viewScale), ((clickPY - viewPY) / viewScale));
    }

    disconnectAllDoors() {
        if (!this.doorConnectionSaves) {
			this.doorConnectionSaves = Array();
			for (var d = 0; d < this.doors.length; d++) {
				var save = this.doors[d].disconnect();
				if (save) {
					this.doorConnectionSaves.push(save);
				}
			}
		}
    }

    reconnectAllDoors() {
        if (this.doorConnectionSaves) {
			for (var s = 0; s < this.doorConnectionSaves.length; s++) {
				this.doorConnectionSaves[s][0].reconnect(this.doorConnectionSaves[s]);
			}
			this.doorConnectionSaves = null;
		}
	}

	removeCollisions() {
		var collidedRooms = this.getAllCollidedRooms();
		for (var r = 0; r < collidedRooms.length; r++) {
			var room = collidedRooms[r];
			room.updateBoundsPositions();
			room.checkCollided();
		    room.checkErrors();
		}
	}

    setDragOffset(offsetPX, offsetPY, snap, roomList) {
		if (offsetPX != 0 || offsetPY != 0) {
			// We've actually been dragged.  Set the flag and disconnect doors.
			this.dragging = true;
			this.disconnectAllDoors();

		} else if (offsetPX == 0 && offsetPY == 0) {
			// either dragging was canceled or we've been dragged back to our starting position.  Reconnect doors that
			// were disconnected.
			this.reconnectAllDoors();
		}

		if (this.grid) {
		    this.grid.style.filter = "brightness(200%)";
		}

        // start by snapping to the nearest meter
        this.mdragOffset.set(Math.round(offsetPX / viewScale), Math.round(offsetPY / viewScale));

		// update door positions now so we can use them to figure out door snapping
		this.updateDoorPositions();

		// calculate the click point position
		var click = this.clickP.add(this.mdragOffset);
		// we want the door closest to the click point
		var doorDist = -1;
		// these will get filled in if we find a door pair to snap to
		var snapDoor = null;
		var snapOtherDoor = null;
		// iterate over our doors
		for (var d = 0; d < this.doors.length; d++) {
			var door = this.doors[d];
			// see if our door has any collisions
			if (door.collisions.length > 0) {
				// see if this door is closer to the click point than the previous door, if any
				var doorDist2 = click.subtract(door.mv).lengthSquared();
				if (doorDist > -1 && doorDist < doorDist2) {
					continue;
				}
				// we're snapping with this door unless we find a closer one
				doorDist = doorDist2;
				snapDoor = door;
				// we want the other door that's closest to the click point
				var otherDoorDist = -1;
				// iterate over the other doors
				for (var c = 0; c < door.collisions.length; c++) {
					var otherDoor = door.collisions[c];
					// see if this other door is closer to the click point than the previous door, if any
					var otherDoorDist2 = click.subtract(otherDoor.mv).lengthSquared();
					if (otherDoorDist > -1 && otherDoorDist < otherDoorDist2) {
						continue;
					}
					// we're snapping to this door unless we find a closer one
					otherDoorDist = otherDoorDist2;
					snapOtherDoor = otherDoor;
				}
			}
		}

		var snapped = false;

		// did we find a pair of doors to snap?
		if (snapDoor && snapOtherDoor) {
			// calculate the difference between the two door positions
			var snapOffset = snapOtherDoor.mv.subtract(snapDoor.mv);
			// adjust the drag offset
			this.mdragOffset.addTo(snapOffset.x, snapOffset.y);
			snapped = true;

		// do we have a given snap resolution?
		} else if (!snapped && snap > 1) {
			// round the final x coordinate
            var mx = this.mv.x + this.mdragOffset.x;
            var mx2 = Math.round(mx / snap) * snap;

			// round the final y coordinate
            var my = this.mv.y + this.mdragOffset.y;
            var my2 = Math.round(my / snap) * snap;

			// adjust the drag offset
            this.mdragOffset.addTo(mx2 - mx, my2 - my);
            snapped = true;
        }

		if (snapped) {
			// update the door positions again if we snapped.
			this.updateDoorPositions();
		}

		// finally we can update the bounds positions
		this.updateBoundsPositions();
    }

    dropDragOffset() {
        // check if we actually dragged anywhere
        if (this.mdragOffset.x != 0 || this.mdragOffset.y!= 0) {
            // calculate the new position
            var nmv = this.mv.add(this.mdragOffset);
            // reset the drag offset
            this.mdragOffset.set(0, 0);
	        // commit the position change
            this.setPositionAndConnectDoors(nmv.x, nmv.y, this.floor, this.rotation);

        } else {
            this.reconnectAllDoors();
        }

		// dragging is finished.
        this.dragging = false;
        if (this.grid) {
            this.checkCollided();
        }
        if (this.outline) {
		    this.checkErrors();
        }

        // clear the click point
        this.clickP = null;
    }

    addDisplay(viewContainer) {
        this.viewContainer = viewContainer;
        if (this.isVisible()) {
	        this.display = this.addDisplayElement("-display.png", 2);
	        this.marker = this.addDisplayElement(".png", 3, true);
			for (var b = 0; b < this.doors.length; b++) {
				this.doors[b].addDisplay(viewContainer);
			}
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].addDisplay(viewContainer);
			}
	        this.updateView();
        }

		this.checkCollided();
	    this.checkErrors();
    }

    addDisplayElement(imageSuffix, zIndex = 0, marker = false) {
        var imageBase = marker ? this.getMarkerImageBase() : this.getImageBase();
        if (!imageBase) {
            return null;
        }
        // Ugh, have to build the <img> element the hard way
        var element = document.createElement("img");
        element.style = "position: absolute;";
        if (!marker) {
	        // Need to explicitly set the transform origin for off-center rooms
	        element.style.transformOrigin = (-this.anchorMX * imgScale) + "px " + (-this.anchorMY * imgScale) + "px";
        }
        element.style.zIndex = zIndex;
        element.id = this.id;
		// have to explicitly tell Chrome that none of these listeners are passive or it will cry
        element.addEventListener("mousedown", mouseDown, { passive: false });
        element.addEventListener("contextmenu", contextMenu, { passive: false });
        element.addEventListener("touchstart", touchStart, { passive: false });
        element.addEventListener("wheel", wheel, { passive: false });
        element.src = "img" + imgScale + "x/" + imageBase + imageSuffix;
        element.room = this;
        this.viewContainer.appendChild(element);
        return element;
    }

    getImageBase(whichFloor = null) {
        if (whichFloor == null) {
            whichFloor = viewFloor;
        }
		if (this.multifloor) {
			var displayFloor = whichFloor - this.floor;
			for (var i = 0; i < this.metadata.floor_images.length; i++) {
				if (this.metadata.floor_images[i].floor == displayFloor) {
					return this.metadata.floor_images[i].image;
				}
			}
		}

		return this.metadata.image
    }

    getMarkerImageBase(whichFloor = null) {
        if (whichFloor == null) {
            whichFloor = viewFloor;
        }
		if (this.multifloor) {
			var displayFloor = whichFloor - this.floor;
			for (var i = 0; i < this.metadata.floor_images.length; i++) {
				if (this.metadata.floor_images[i].floor == displayFloor) {
					return this.metadata.floor_images[i].marker_image;
				}
			}
		}

		return null;
    }

    removeDisplay() {
        // remove the images, whichever ones are presesnt
	    this.display = this.removeDisplayElement(this.display);
	    this.marker = this.removeDisplayElement(this.marker);
	    this.outline = this.removeDisplayElement(this.outline);
	    this.grid = this.removeDisplayElement(this.grid);
	    // remove bounds debug boxes, if present
		for (var b = 0; b < this.doors.length; b++) {
			this.doors[b].removeDisplay();
		}
		for (var b = 0; b < this.bounds.length; b++) {
			this.bounds[b].removeDisplay();
		}
        this.viewContainer = null;
    }

    removeDisplayElement(element) {
	    if (element) {
            element.remove();
        }
        return null;
    }

    updateView() {
        if (this.display || this.grid) {
            var transform = this.getImageTransform(viewPX, viewPY, viewScale);
			// update the three images, whichever ones are present
			this.updateViewElement(this.display, transform);
			this.updateViewElement(this.outline, transform);
			this.updateViewElement(this.grid, transform);
			if (this.marker) {
	            var transform2 = this.getMarkerImageTransform(viewPX, viewPY, viewScale);
				this.updateViewElement(this.marker, transform2);
			}
			// update debug bounds views, if present
			for (var d = 0; d < this.doors.length; d++) {
				this.doors[d].updateView();
			}
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].updateView();
			}
        }
    }

	getImageTransform(viewPX, viewPY, viewScale) {
        // transform the anchor coords to pixel coords
		var roomViewCenterPX = ((this.mv.x + this.mdragOffset.x) * viewScale) + viewPX;
		var roomViewCenterPY = ((this.mv.y + this.mdragOffset.y) * viewScale) + viewPY;
		// we have to add the anchor points scaled by the image scale rather than the view scale in order for the
		// css transform to put the room in the right place.  so much trial and error to get this rght...
        var roomViewPX = roomViewCenterPX + (this.anchorMX * imgScale);
        var roomViewPY = roomViewCenterPY + (this.anchorMY * imgScale);

		// final scaling of the image
		var scale = viewScale / imgScale;

	    // https://www.w3schools.com/cssref/css3_pr_transform.asp
	    // translate() need to be before rotate() and scale()
		return "translate(" + roomViewPX + "px, " + roomViewPY + "px) rotate(" + this.rotation + "deg) scale(" + scale + ", " + scale + ")";
	}

	getMarkerImageTransform(viewPX, viewPY, viewScale) {
        // transform the room center coords to pixel coords
		var roomViewCenterPX = ((this.mv.x + this.mdragOffset.x) * viewScale) + viewPX;
		var roomViewCenterPY = ((this.mv.y + this.mdragOffset.y) * viewScale) + viewPY;

		// final scaling of the image
		var scale = viewScale / imgScale;

		// translate by the pixel coords, and then back by 50% to center the image
		return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) scale(" + scale + ", " + scale + ")";
	}

    updateViewElement(e, transform) {
        if (e) {
		    e.style.transform = transform;
        }
    }

    toString() {
        return this.metadata.id + ":" + this.id + ":(" + this.mv.x + ", " + this.mv.y + ", " + this.floor + ")";
    }
}

class DojoBounds {
	constructor() {
		this.x1 = 100000;
		this.x2 = -100000;
		this.y1 = 100000;
		this.y2 = -100000;
		this.f1 = 100000;
		this.f2 = -100000;
	}
	
	includeAll() {
		for (var r = 0; r < roomList.length; r++) {
			this.includeRoom(roomList[r]);
		}
	}
	
	includeRoom(room) {
		for (var b = 0; b < room.bounds.length; b++) {
			var bound = room.bounds[b];
			if (!bound.invisible) {
				this.includeBound(bound);
			}
			var floors = room.getFloors();
			for (var f = 0; f < floors.length; f++) {
				if (floors[f] < this.f1) { this.f1 = floors[f]; }
				if (floors[f] > this.f2) { this.f2 = floors[f]; }
			}
		}
	}
	
	includeBound(bound) {
		if (this.x1 > bound.x1) { this.x1 = bound.x1; }
		if (this.x2 < bound.x2) { this.x2 = bound.x2; }
		if (this.y1 > bound.y1) { this.y1 = bound.y1; }
		if (this.y2 < bound.y2) { this.y2 = bound.y2; }
	}
	
	width() { return Math.abs(this.x2 - this.x1); }

	height() { return Math.abs(this.y2 - this.y1); }
}

function getDojoBounds() {
	var db = new DojoBounds();
	db.includeAll();
	return db;
}

function convertToPngs(db, margin, scale) {
	// build a list of divs to hold the links
	var linkDivs = Array();
	for (var f = db.f1; f <= db.f2; f++) {
		var div = document.createElement("div");
		div.innerHTML = `...`;
		linkDivs[f] = div;
	}

	// ffs image objects loading asynchronously in the backround make it so much harder than it should be to make this
	// reliable.  Is this really the only way to draw an image on a canvas?

	// start with the bottom floor, this will eventually make it through all of them.
	convertFloorToPngLink(linkDivs, db, margin, scale, db.f1);

	return linkDivs;
}

// state for asynchronous image loading
var drawnImages = 0;
var loadedImages = 0;
var loadedImageData = null;

function convertFloorToPngLink(targets, db, margin, scale, f) {
	// calculate the point in the image that represents (0, 0) in meter-space
    var roomViewCenterPX = margin + (-db.x1 * scale);
    var roomViewCenterPY = margin + (-db.y1 * scale);

	var localDrawnImages = 0;
	drawnImages = 0;
	loadedImages = 0;
	loadedImageData = Array();

	for (var r = 0; r < roomList.length; r++) {
		var room = roomList[r];
		// check if the room is visible on the given floor
		if (room.isVisible(f)) {
			// build an image link because that's what context.drawImage wants
            var img = new Image();
            // we have store parameters in the img object itself
            img.index = localDrawnImages;
            img.room = room;
            // omg is this really the only reliable way to draw an image on a canvas?!
            img.onload = function() {
	            var index = this.index;
                var room = this.room;
				// start by putting the anchor into a vect
				var av = new Vect(room.anchorMX, room.anchorMY);
				// rotate the anchor point by the room's rotation
	            av = av.rotate(room.rotation)
	                // add to the room's position
	                .add(room.mv)
	                // scale by the scale, they are now pixel coords
	                .scale(scale)
	                // add to the center point
	                .addTo(roomViewCenterPX, roomViewCenterPY);

				// calculate basis vectors starting from the transformed anchor point
	            var vx = new Vect(scale / imgScale, 0).rotate(room.rotation);
	            var vy = new Vect(0, scale / imgScale).rotate(room.rotation);

				// notify
//				imageLoaded(targets, db, margin, scale, f, 1);
				imageLoaded(targets, db, margin, scale, f, index, this, vx.x, vx.y, vy.x, vy.y, av.x, av.y);
            }
            img.src = "img" + imgScale + "x/" + room.getImageBase(f) + "-display.png";
			localDrawnImages++;

			// see if the room has a marker
			var markerImageBase = room.getMarkerImageBase(f);
			if (markerImageBase) {
				// build an image link because that's what context.drawImage wants
                var img2 = new Image();
                // we have store parameters in the img object itself
                img2.index = localDrawnImages;
                img2.room = room;
	            // omg is this really the only reliable way to draw an image on a canvas?!
                img2.onload = function() {
	                var index = this.index;
                    var room = this.room;
					// the marker is a little simpler because we don't have to rotate it and it's always centered
					// start with the room coords
					// it's also more complicated because we need its dimensions, which we don't have until it's loaded
					var av2 = room.mv.copy()
		                // scale by the scale, they are now pixel coords
		                .scale(scale)
		                // add to the center point
		                .addTo(roomViewCenterPX, roomViewCenterPY)
		                // center the image
		                .addTo(-img2.width * (scale / imgScale) / 2, -img2.height * (scale / imgScale) / 2);

					// notify
//					imageLoaded(targets, db, margin, scale, f, 1);
					imageLoaded(targets, db, margin, scale, f, index, this, scale / imgScale, 0, 0, scale / imgScale, av2.x, av2.y);
				}
	            img2.src = "img" + imgScale + "x/" + markerImageBase + ".png";
				localDrawnImages++;
			}
		}
	}

	// showDebug("Floor " + f + ": " + localDrawnImages + " images drawn");

	// we're done drawing images
	drawnImages = localDrawnImages;
	// just in case everything is already done.
	imageLoaded(targets, db, margin, scale, f, null, null);
}

function imageLoaded(targets, db, margin, scale, f, index, image, xx, xy, yx, yy, tx, ty) {
	// todo: cancel if the menu has been closed before we're finished.

	// if there's an image
	if (image) {
		// increment our count and save the image + transform for later
		loadedImages++;
		loadedImageData[index] = [image, xx, xy, yx, yy, tx, ty];
	}
	// ether we haven't finished drawing images or we haven't finished loading them
	if (drawnImages == 0 || loadedImages < drawnImages) {
		return;
	}

	// all images have been loaded
	// showDebug("Floor " + f + ": " + loadedImages + " images loaded");

	// create the canvas
	var canvas = document.createElement("canvas");
	canvas.width = (db.width() * scale) + (margin * 2);
	canvas.height = (db.height() * scale) + (margin * 2);

    // get the graphics context, this is what we'll do all our work in
    var context = canvas.getContext("2d");

    // fill the whole canvas with a background color, otherwise it will be transparent
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < loadedImageData.length; i++) {
        var a = loadedImageData[i];
        // set the transform with the two basis vectors and the translate vector
        context.setTransform(a[1], a[2], a[3], a[4], a[5], a[6]);
		// draw the image at the center of the new coordinate space
		context.drawImage(a[0], 0, 0);
		// reset the transform
		context.resetTransform();
    }

	var floorName = getFloorName(f);

    // set up the title text
    context.font = (16 * scale) + "px Arial";
    context.textAlign = "left";
    context.fillStyle = "#8080FF";
    // title
    context.fillText("Floor " + floorName, 8*scale, 24*scale);

	var link = convertToPngLink(canvas, "dojo-floor-" + floorName);
    link.onclick = doPngClick;
	targets[f].innerHTML = ``;
	targets[f].appendChild(link);
	if (targets[f + 1]) {
		convertFloorToPngLink(targets, db, margin, scale, f + 1);
	}
}

function findHighestDoor(room) {
	var door = null;
	for (var d = 0; d < room.doors.length; d++) {
		var door2 = room.doors[d];
		if (door == null || door2.metadata.floor > door.metadata.floor) {
			door = door2;
		}
	}
	return door;
}

function buildTd(html) {
	var td = document.createElement("td");
	td.innerHTML = html;
	return td;
}

function buildTh(html) {
	var th = document.createElement("th");
	th.innerHTML = html;
	return th;
}

function buildTr(tdList) {
	var tr = document.createElement("tr");
	for (var i = 0; i < tdList.length; i++) {
		tr.appendChild(tdList[i]);
	}
	return tr;
}

function buildCollisionMatrix(table) {
	var roomMetadataList = roomMetadata.rooms;

	var tdList = Array();
    tdList.push(buildTd(""));
    for (var r1 = 0; r1 < roomMetadataList.length; r1++) {
        var rmd1 = roomMetadataList[r1];
		tdList.push(buildTh(rmd1.id));
    }
	table.appendChild(buildTr(tdList));

    for (var r1 = 0; r1 < roomMetadataList.length; r1++) {
        tdList = Array();
        var rmd1 = roomMetadataList[r1];
        var lowerRoom = new Room(rmd1)
        var lowerDoor = findHighestDoor(lowerRoom);
        lowerRoom.setPosition(-lowerDoor.metadata.x, -lowerDoor.metadata.y, 100-lowerDoor.metadata.floor, 0);

		tdList.push(buildTh(rmd1.id));

	    for (var r2 = 0; r2 < roomMetadataList.length; r2++) {
	        var rmd2 = roomMetadataList[r2];
	        var upperRoom = new Room(rmd2);
	        var upperDoor = upperRoom.doors[0];
            upperRoom.setPosition(-upperDoor.metadata.x, -upperDoor.metadata.y, 101, 0);

			var collide = findCollisions(lowerRoom.bounds, upperRoom.bounds).length > 0;
			var shouldCollide = rmd1.blockedFromAboveBy && (rmd1.blockedFromAboveBy.indexOf(rmd2.id) >=0);

			if (collide) {
				var td = buildTd("X");
				if (!shouldCollide) {
					td.className = "matrix-error";
				}
				tdList.push(td);

			} else {
				var td = buildTd("");
				if (shouldCollide) {
					td.className = "matrix-error";
				}
				tdList.push(td);
			}
        }
		table.appendChild(buildTr(tdList));
    }
}