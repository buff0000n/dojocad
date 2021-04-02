// Sorry, this is Grade-A Fancy spaghetti code

//==============================================================
// Bound object
//==============================================================

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
        var rotation = (this.room.rotation + this.room.mdragOffsetRotation) % 360;
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
	        if (this.room.isOnFloor()) {
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

	clearCollisions(exceptRooms = null) {
	    for (var c = this.collisions.length - 1; c >= 0; c--) {
	        if (!exceptRooms || !exceptRooms.includes(this.collisions[c].room)) {
                this.removeCollision(this.collisions[c]);
	        }
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder && this.room.isOnFloor()) {
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

//==============================================================
// Door object
//==============================================================

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

        this.marker = null;
    }

    updatePosition() {
        var roomRotation = (this.room.rotation + this.room.mdragOffsetRotation) % 360;
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate(roomRotation).add(this.room.mv).add(this.room.mdragOffset);;
        this.outv = new Vect(this.metadata.outx, this.metadata.outy).rotate(roomRotation);
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
            this.debugBorder.remove();
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

        if (this.debugBorder && this.room.isOnFloor()) {
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
        if (this.debugBorder && !this.otherDoor && this.floor == viewFloor) {
            viewContainer.appendChild(this.debugBorder);
        }
    }

    showDoorMarker() {
        if (this.floor == viewFloor && !this.otherDoor) {
	        if (!this.marker) {
	            this.marker = this.room.addDisplayImage(".png", 205, "marker-door", true);
	        } else {
		        this.room.viewContainer.appendChild(this.marker);
	        }
	        this.updateView();
        }
    }

    hideDoorMarker() {
        if (this.marker) {
            this.marker.remove();
            // this.marker = null;
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = (this.x1 * viewScale) + viewPX;
			this.debugBorder.style.top = (this.y1 * viewScale) + viewPY;
			this.debugBorder.style.width = (this.x2 - this.x1) * viewScale;
			this.debugBorder.style.height = (this.y2 - this.y1) * viewScale;
        }
        if (this.marker) {
            var transform2 = this.room.getDoorMarkerImageTransform(this.mv.x, this.mv.y, this.rotation, viewPX, viewPY, viewScale);
			this.room.updateViewElement(this.marker, transform2);
        }
    }

    removeDisplay() {
        this.hideDoorMarker();
        if (this.debugBorder) {
            this.debugBorder.remove();
        }
    }
}

//==============================================================
// Marker object
//==============================================================

class Marker {
	constructor(room, floor, metadata) {
		this.room = room;
		this.metadataFloor = floor;
		if (metadata == null) {
			throw "OOOOPS";
		}
		this.metadata = metadata;
		this.marker = null;
	}

    updatePosition() {
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate((this.room.rotation + this.room.mdragOffsetRotation) % 360).add(this.room.mv);
        this.floor = this.room.floor + this.metadataFloor;
    }

    addDisplay(viewContainer) {
        if (this.floor == viewFloor) {
	        this.marker = this.room.addDisplayImage(".png", 204, this.metadata.image, true);
        }
    }

    updateView() {
        if (this.marker) {
            var transform2 = this.room.getMarkerImageTransform(this.mv.x, this.mv.y, viewPX, viewPY, viewScale);
			this.room.updateViewElement(this.marker, transform2);
        }
    }

    removeDisplay() {
        if (this.marker) {
            this.marker.remove();
            this.marker = null;
        }
    }
}

//==============================================================
// Room object utils
//==============================================================

// needs to be a global regex so all occurrences are replaced
var quoteRegex = new RegExp('"', "g");
var newlineRegex = new RegExp('\n', "g");

function roomToString(room) {
    var s = room.metadata.id + "," + room.mv.x + "," + room.mv.y + "," + room.floor + "," + (room.rotation / 90)
    if (room.hue != null || room.label != null) {
        s = s + "," + (room.hue == null ? "" : room.hue);
        if (room.label != null) {
            s = s + ',"' + room.label.replace(quoteRegex, '\\"') + '"'
        }
    }
    return s;
}

function roomFromString(string) {
    var s = quotedSplit(string, ",");
    var room = new Room(getRoomMetadata(s[0]));
    // room coordinates may be fractional because of old dojo rooms, floor and rotation are still ints
    room.setPosition(parseFloat(s[1]), parseFloat(s[2]), parseInt(s[3]), parseInt(s[4]) * 90);
    if (s.length > 5) {
        if (s[5].length > 0) {
            room.setHue(parseInt(s[5]));
        }
        if (s.length > 6) {
            room.setLabel(s[6]);
        }
    }
    return room;
}

var roomIdCount = 0;

//==============================================================
// Room object
//==============================================================

class Room {
    constructor(metadata) {
        this.mv = new Vect(0, 0);
        this.mdragOffset = new Vect(0, 0);
        this.mdragOffsetRaw = new Vect(0, 0);
        this.mdragOffsetRotation = 0;
        this.mrotationOffset = null;
        this.dragging = false;
        this.placed = false;

        this.ignoreRooms = null;

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

        this.markers = Array();
		if (this.metadata.floor_images) {
	        for (var i = 0; i < this.metadata.floor_images.length; i++) {
	            var fi = this.metadata.floor_images[i];
	            if (fi.marker_images) {
			        for (var j = 0; j < fi.marker_images.length; j++) {
			            var m = fi.marker_images[j];
			            this.markers.push(new Marker(this, fi.floor, m));
		            }
		        }
	        }
		}
//        this.multifloor = this.metadata.floor_images != null && this.metadata.floor_images.length > 1;
        this.multifloor = this.metadata.multifloor ? true : false;

        this.floor = null;
        this.allFloors = null;

		this.viewContainer = null;
        this.display = null;
        this.otherFloorDisplay = null;
        this.outline = null;
        this.grid = null;
        this.labelDisplay = null;

        this.selected = false;

        this.hue = null;
        this.label = this.metadata.defaultLabel ? this.metadata.defaultLabel : null;

        this.calculateAnchor();
        this.ruleErrors = Array();
        this.ruleWarnings = Array();
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

	addRuleWarning(rule) {
		addToListIfNotPresent(this.ruleWarnings, rule);
	}

	removeRuleWarning(rule) {
		removeFromList(this.ruleWarnings, rule);
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

    getAllWarnings() {
		return this.ruleWarnings.length > 0 ? this.ruleWarnings : null;
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
        if (!this.metadata.floor_images || this.metadata.floor_images.length == 1) {
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

    isOnFloor(whichFloor = null) {
        if (whichFloor == null) {
            whichFloor = viewFloor;
        }
        if (this.floor == whichFloor) {
            return true;
        }
        if (!this.multifloor) {
            return false;
        }
		for (var d = 0; d < this.doors.length; d++) {
			if (this.doors[d].floor == whichFloor) {
				return true;
			}
		}
		return false;
    }

    getFloors() {
        if (this.allFloors) {
            return this.allFloors;
        }

        if (!this.metadata.floor_images || this.metadata.floor_images.length == 1) {
            this.allFloors = [this.floor];

        } else {
            // get the floor list from the doors.  The image list may contain extra floor images that we don't want to
            // include unless there's something else on that floor.  It's the Dry Dock, I'm talking about the Dry Dock.
            this.allFloors = Array();
            for (var d = 0 ; d < this.doors.length; d++) {
                addToListIfNotPresent(this.allFloors, this.doors[d].floor);
            }
        }

		return this.allFloors;
    }

    setDebug(debug) {
        for (var i = 0; i < this.doors.length; i++) {
            this.doors[i].setDebug(debug);
        }
        for (var i = 0; i < this.bounds.length; i++) {
            this.bounds[i].setDebug(debug);
        }
    }

    setPosition(nmx, nmy, nf, nr, updateFloors = true, fullUpdate = true) {
        var isNewFloor = updateFloors && nf != this.floor;
        if (isNewFloor) {
			this.removeAllRuleErrors();
        }
        this.mv = new Vect(nmx, nmy);
        if (this.floor != nf) {
            this.allFloors = null;
        }
        this.floor = nf;
        this.rotation = nr;
        if (fullUpdate) {
    		this.updateMarkerPositions();
        }

        if (fullUpdate) {
            if (isNewFloor) {
                this.removeDisplay();
                this.addDisplay(getRoomContainer());
                this.reAddAllRuleErrors();
            }
            this.updateDoorPositions();
            this.updateBoundsPositions();
        }
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

		this.placed = true;
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

	updateMarkerPositions() {
        for (var m = 0; m < this.markers.length; m++) {
            this.markers[m].updatePosition();
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
                    // skip omitted rooms
                    if (this.ignoreRooms != null && this.ignoreRooms.includes(roomList[r])) {
                        continue;
                    }
					// see if the room isn't this room and has doors facing the other direction
					if (room != this && room.angleToDoors[a2] && (this.ignoreRooms == null || !this.ignoreRooms.includes(room))) {
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
            bound.clearCollisions(this.ignoreRooms);

			// iterate over the global room list
			for (var r = 0; r < roomList.length; r++) {
				var room = roomList[r];
				// skip omitted rooms
				if (this.ignoreRooms != null && this.ignoreRooms.includes(roomList[r])) {
				    continue;
				}
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
			        this.grid = this.addDisplayImage("-bounds-blue.png", 201);
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
			        this.outline = this.addDisplayImage("-line-blue.png", 203);
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
		        this.outline = this.addDisplayImage("-line-blue.png", 203);
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

        for (var b = this.bounds.length - 1; b >= 1; b--) {
            if (this.metadata.bounds[b].discard) {
                this.bounds.splice(b, 1);
            }
        }
    }

    select() {
        this.selected = true;
        if (!this.outline) {
	        this.outline = this.addDisplayImage("-line-blue.png", 203);
        }
        if (!this.grid) {
	        this.grid = this.addDisplayImage("-bounds-blue.png", 201);
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

    rotateAround(centerM) {
        var newRotation = (this.mdragOffsetRotation + 90) % 360;
        var fromCenter = this.mv.subtract(centerM).rotate(newRotation);
        var rotationOffsetM = fromCenter.add(centerM).subtract(this.mv);
        this.rotate(rotationOffsetM);
    }

    rotate(rotationOffsetM = null) {
        if (this.dragging) {
            this.mrotationOffset = rotationOffsetM;
            // todo: save the original drag offset so we can reset the position if the room is rotated away from a door snapping zone
	        this.setDragOffset(null, null, (this.mdragOffsetRotation + 90) % 360);

        } else {
		    this.disconnectAllDoors(this.rooms);
	        this.setPositionAndConnectDoors(
	            this.mv.x + (rotationOffsetM ? rotationOffsetM.x : 0),
	            this.mv.y + (rotationOffsetM ? rotationOffsetM.y : 0),
	            this.floor, (this.rotation + 90) % 360);
        }
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
			    var door = this.doors[d];
			    if (this.ignoreRooms != null && this.ignoreRooms.includes(door.room) &&
			        door.otherDoor && this.ignoreRooms.includes(door.otherDoor.room)) {
			        continue;
                }
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

    setDraggingDisplay() {
		if (this.grid) {
		    this.grid.style.filter = "brightness(200%)";
		}
    }

    getDoors() {
        return this.doors;
    }

    setMDragOffset(offsetX, offsetY) {
        this.mdragOffsetRaw.set(offsetX, offsetY);
        if (this.mrotationOffset) {
            this.mdragOffset.set(offsetX + this.mrotationOffset.x, offsetY + this.mrotationOffset.y);
        } else {
            this.mdragOffset.set(offsetX, offsetY);
        }
    }

    setDragOffset(offsetMX, offsetMY, offsetRotation, commit = true) {
		if (offsetMX != null && (offsetMX != 0 || offsetMY != 0) || (offsetRotation != null && offsetRotation != 0)) {
			// We've actually been dragged.  Set the flag and disconnect doors.
			this.dragging = true;
			this.disconnectAllDoors();
		}

        this.setDraggingDisplay();

        if (offsetMX != null) {
            this.setMDragOffset(offsetMX, offsetMY);
        }
        if (offsetRotation != null) {
            this.mdragOffsetRotation = offsetRotation;
            if (this.mrotationOffset) {
                this.setMDragOffset(this.mdragOffsetRaw.x, this.mdragOffsetRaw.y);
            }
        }

		// always update door positions now so we can use them to figure out door snapping
		this.updateDoorPositions();

        // check if this is the final offset
		if (commit) {
            // finally we can update the bounds positions
            this.updateBoundsPositions();
            // don't forget markers
            this.updateMarkerPositions();
		}
    }

    resetDragOffset() {
        this.mdragOffset.set(0, 0);
        this.mdragOffsetRaw.set(0, 0);
        this.mdragOffsetRotation = 0;
        this.mrotationOffset = null;
    }

    getClosestDoorSnapPair() {
		// calculate the click point position
		var click = this.clickP.add(this.mdragOffset);
		// we want the door closest to the click point
		var doorDist = -1;
		// these will get filled in if we find a door pair to snap to
		var snapDoor = null;
		var snapOtherDoor = null;
		// iterate over our doors
		var doors = this.getDoors();
		for (var d = 0; d < doors.length; d++) {
			var door = doors[d];
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

		if (snapDoor && snapOtherDoor) {
		    return { "door": snapDoor, "otherDoor": snapOtherDoor };

		} else {
		    return null;
		}
    }

    dropDragOffset() {
        // check if we actually dragged anywhere
        if (this.mdragOffset.x != 0 || this.mdragOffset.y!= 0 || this.mdragOffsetRotation != 0) {
            // calculate the new position
            var nmv = this.mv.add(this.mdragOffset);
			var nr = (this.rotation + this.mdragOffsetRotation) % 360;
            // reset the drag offsets
            this.resetDragOffset();
	        // commit the position change
            this.setPositionAndConnectDoors(nmv.x, nmv.y, this.floor, nr);

        } else {
            this.reconnectAllDoors();
        }

		// dragging is finished.
        this.dragging = false;
        this.checkThings();

        // clear the click point
        this.clickP = null;
    }

    checkThings() {
        if (this.grid) {
            this.checkCollided();
        }
        if (this.outline) {
		    this.checkErrors();
        }
    }

    setLabel(label) {
        this.label = label ? label : this.metadata.defaultLabel ? this.metadata.defaultLabel : null;
        this.updateLabelDisplay();
        this.updateView();
    }

    setHue(hue) {
        if (hue != this.hue) {
            var previousHue = this.hue;
            this.hue = hue;
            if (previousHue == null || hue == null) {
                this.resetColorDisplay();
            }
			this.display.style.filter = this.getDisplayImageFilter();
			if (this.labelDisplay) {
			    this.labelDisplay.style.color = this.getDisplayLabelColor();
			}
        }
    }

    updateLabelDisplay() {
        if (this.label) {
            if (!this.labelDisplay) {
	            this.labelDisplay = this.addDisplayLabel();
			    this.labelDisplay.style.color = this.getDisplayLabelColor();
            }
            this.labelDisplay.innerHTML = this.label.replace(newlineRegex, "<br/>");
        } else if (this.labelDisplay) {
            this.labelDisplay = this.removeDisplayElement(this.labelDisplay);
        }
    }

    resetColorDisplay() {
        if (this.display) {
            this.display.remove();
        }
        this.display = this.addDisplayImage(this.getDisplayImageSuffix(), 202);
        this.display.style.filter = this.getDisplayImageFilter();
        this.updateView();
    }

    getDisplayImageSuffix() {
        return this.hue ? "-display-red.png" : "-display.png";
    }

    getDisplayImageFilter() {
        return this.hue ? " hue-rotate(" + this.hue + "deg)" : "";
    }

    getDisplayLabelColor() {
        return this.hue ? "hsl(" + this.hue + ", 75%, 75%)" : "hsl(0, 0%, 100%)";
    }

    addDisplay(viewContainer) {
        this.viewContainer = viewContainer;
        if (this.isVisible()) {
            // main visible display
	        this.display = this.addDisplayImage(this.getDisplayImageSuffix(), 202);
			this.display.style.filter = this.getDisplayImageFilter();
	        if (!this.isOnFloor()) {
	            // additional other floor display
		        this.otherFloorDisplay = this.addDisplayImage(this.getDisplayImageSuffix(), 100 + this.floor, this.getImageBase(this.floor));
			    this.otherFloorDisplay.style.filter = "brightness(25%)" + this.getDisplayImageFilter();
	        }
            this.updateLabelDisplay();
			for (var m = 0; m < this.markers.length; m++) {
				this.markers[m].addDisplay(viewContainer);
			}
			for (var b = 0; b < this.doors.length; b++) {
				this.doors[b].addDisplay(viewContainer);
			}
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].addDisplay(viewContainer);
			}
	        this.updateView();

        } else {
	        // just the other floor display
	        this.otherFloorDisplay = this.addDisplayImage(this.getDisplayImageSuffix(), 100 + this.floor);
		    this.otherFloorDisplay.style.filter = "brightness(25%)" + this.getDisplayImageFilter();
        }

		this.checkCollided();
	    this.checkErrors();
    }

    addDisplayImage(imageSuffix, zIndex = 200, imageBase = null, marker = false) {
        if (!imageBase) {
            imageBase = this.getImageBase();
        }
        if (!imageBase) {
            return null;
        }
        // Ugh, have to build the <img> element the hard way
        var element = document.createElement("img");
        if (!marker) {
	        // Need to explicitly set the transform origin for off-center rooms
	        element.style.transformOrigin = (-this.anchorMX * imgScale) + "px " + (-this.anchorMY * imgScale) + "px";
        }
        element.src = "img" + imgScale + "x/" + imageBase + imageSuffix;

        return this.addDisplayImageElement(element, zIndex);
    }

    addDisplayLabel(zIndex = 300) {
        var element = document.createElement("div");
        element.className = "roomLabel";

        return this.addDisplayImageElement(element, zIndex);
    }

    addDisplayImageElement(element, zIndex = 200) {
        element.style.position = "absolute";
        element.style.zIndex = zIndex;
        element.roomId = this.id;
		// have to explicitly tell Chrome that none of these listeners are passive or it will cry
        element.addEventListener("mousedown", mouseDown, { passive: false });
        element.addEventListener("contextmenu", contextMenu, { passive: false });
        element.addEventListener("touchstart", touchStart, { passive: false });
        element.addEventListener("wheel", wheel, { passive: false });
        element.room = this;
        this.viewContainer.appendChild(element);
        return element;
    }

    getImageBase(whichFloor = null) {
        if (whichFloor == null) {
            whichFloor = viewFloor;
        }
		if (this.metadata.floor_images) {
			var displayFloor = whichFloor - this.floor;
			for (var i = 0; i < this.metadata.floor_images.length; i++) {
				if (this.metadata.floor_images[i].floor == displayFloor) {
					return this.metadata.floor_images[i].image;
				}
			}
		}

		return this.metadata.image
    }

    removeDisplay() {
        // remove the images, whichever ones are presesnt
	    this.display = this.removeDisplayElement(this.display);
	    this.otherFloorDisplay = this.removeDisplayElement(this.otherFloorDisplay);
	    this.outline = this.removeDisplayElement(this.outline);
	    this.grid = this.removeDisplayElement(this.grid);
		this.labelDisplay = this.removeDisplayElement(this.labelDisplay);

		for (var m = 0; m < this.markers.length; m++) {
			this.markers[m].removeDisplay();
		}
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

	showDoorMarkers() {
	    if (this.isOnFloor()) {
	        for (var d = 0; d < this.doors.length; d++) {
	            this.doors[d].showDoorMarker();
	        }
	    }
	}

	hideDoorMarkers() {
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].hideDoorMarker();
        }
	}

    updateView() {
        if (this.display || this.otherFloorDisplay || this.grid) {
            var transform = this.getImageTransform(viewPX, viewPY, viewScale);
            if (this.display || this.grid) {
				// update the three images, whichever ones are present
				this.updateViewElement(this.display, transform);
				this.updateViewElement(this.outline, transform);
				this.updateViewElement(this.grid, transform);
				for (var m = 0; m < this.markers.length; m++) {
					this.markers[m].updateView();
				}
				// update debug bounds views, if present
				for (var d = 0; d < this.doors.length; d++) {
					this.doors[d].updateView();
				}
				for (var b = 0; b < this.bounds.length; b++) {
					this.bounds[b].updateView();
				}
            }
	        if (this.otherFloorDisplay) {
				this.updateViewElement(this.otherFloorDisplay, transform);
	        }
        }
        if (this.labelDisplay) {
            var transform = this.getLabelTransform(viewPX, viewPY, viewScale);
            this.updateViewElement(this.labelDisplay, transform);
        }
    }

	getImageTransform(viewPX, viewPY, viewScale) {
        // transform the anchor coords to pixel coords
		var roomViewCenterPX = ((this.mv.x + this.mdragOffset.x) * viewScale) + viewPX;
		var roomViewCenterPY = ((this.mv.y + this.mdragOffset.y) * viewScale) + viewPY;
		var roomRotation = (this.rotation + this.mdragOffsetRotation) % 360;
		// we have to add the anchor points scaled by the image scale rather than the view scale in order for the
		// css transform to put the room in the right place.  so much trial and error to get this rght...
        var roomViewPX = roomViewCenterPX + (this.anchorMX * imgScale);
        var roomViewPY = roomViewCenterPY + (this.anchorMY * imgScale);

		// final scaling of the image
		var scale = viewScale / imgScale;

	    // https://www.w3schools.com/cssref/css3_pr_transform.asp
	    // translate() need to be before rotate() and scale()
		return "translate(" + roomViewPX + "px, " + roomViewPY + "px) rotate(" + roomRotation + "deg) scale(" + scale + ", " + scale + ")";
	}

	getLabelTransform(viewPX, viewPY, viewScale) {
        // transform the anchor coords to pixel coords
		var roomViewCenterPX = ((this.mv.x + this.mdragOffset.x) * viewScale) + viewPX;
		var roomViewCenterPY = ((this.mv.y + this.mdragOffset.y) * viewScale) + viewPY;

//		// final scaling of the image
		var scale = viewScale;

	    // https://www.w3schools.com/cssref/css3_pr_transform.asp
	    // translate() need to be before rotate() and scale()
		return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) scale(" + scale + ", " + scale + ")";
	}

	getMarkerImageTransform(mx, my, viewPX, viewPY, viewScale) {
        // transform the marker center coords to pixel coords
		var roomViewCenterPX = ((mx + this.mdragOffset.x) * viewScale) + viewPX;
		var roomViewCenterPY = ((my + this.mdragOffset.y) * viewScale) + viewPY;

		// final scaling of the image
		var scale = viewScale / imgScale;

		// translate by the pixel coords, and then back by 50% to center the image
		return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) scale(" + scale + ", " + scale + ")";
	}

	getDoorMarkerImageTransform(mx, my, rotation, viewPX, viewPY, viewScale) {
        // doors' coordinates already include the room's offset
		var roomViewCenterPX = (mx * viewScale) + viewPX;
		var roomViewCenterPY = (my * viewScale) + viewPY;

		// final scaling of the image
		var scale = viewScale / imgScale;

		// translate by the pixel coords, and then back by 50% to center the image
		if (rotation) {
			return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";

		} else {
			return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) scale(" + scale + ", " + scale + ")";
		}
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

//==============================================================
// Room utils
//==============================================================

function cloneRooms(rooms, reposition=true) {
    if (reposition) {
        var centerRoom;
        if (rooms.length == 1) {
            centerRoom = rooms[0];

        } else {
            // find the room closest to the center
            var center = new DojoBounds(rooms).centerPosition().toVect();
            var closestDistSquared = Number.POSITIVE_INFINITY;
            for (var r = 0; r < rooms.length; r++) {
                var ds = rooms[r].mv.distanceSquared(center);
                if (ds < closestDistSquared) {
                    closestDistSquared = ds;
                    centerRoom = rooms[r];
                }
            }
        }
        var newCenterRoom;
    }

    var newRooms = [];

    for (var r = 0; r < rooms.length; r++) {
        var room = rooms[r];
        var newRoom = new Room(room.metadata)
        if (reposition) {
            newRoom.setPosition(
                room.mv.x - centerRoom.mv.x,
                room.mv.y - centerRoom.mv.y,
                room.floor - viewFloor,
                room.rotation, false, false);
            if (room == centerRoom) {
                newCenterRoom = newRoom;
            }
        } else {
            newRoom.setPosition(
                room.mv.x,
                room.mv.y,
                room.floor,
                room.rotation, false, false);
        }
        newRoom.label = room.label;
        newRoom.hue = room.hue;
        newRooms.push(newRoom);
    }

    // okay connecting internal doors let's get stupid
    // loop over original rooms
    for (var r = 0; r < rooms.length; r++) {
        var room1 = rooms[r];
        var room2 = newRooms[r];
        // loop over room's doors
        for (var d = 0; d < room1.doors.length; d++) {
            var door1 = room1.doors[d];
            var door2 = room2.doors[d];
            // if the door has a connection and it's not already connected in the new room
            if (door1.otherDoor && !door2.otherDoor) {
                // get the other door and other room
                var otherDoor1 = door1.otherDoor;
                var otherRoom1 = otherDoor1.room;
                // see if the other room is in the room list
                var or = rooms.indexOf(otherRoom1);
                if (or >= 0) {
                    // get the other door and other on on the new side
                    var od = otherRoom1.doors.indexOf(otherDoor1);
                    otherRoom2 = newRooms[or];
                    otherDoor2 = otherRoom2.doors[od];
                    // Got the two door we need to connect
                    door2.connect(otherDoor2);
                }
            }
        }
    }

    if (reposition) {
        // move the center room to the top of the array, the UI will pick the first room as the cursor/rotation anchor
        removeFromList(newRooms, newCenterRoom);
        newRooms.unshift(newCenterRoom);
    }

    return newRooms;
}

function combineMetadata(rooms) {
    var combo = {};
    combo.id = "multi";
    combo.name = rooms.length + " Rooms";
    combo.capacity = 0;
    combo.energy = 0;
    combo.num = rooms.length;

    var resourceMap = {};

    for (var r = 0; r < rooms.length; r++) {
        var md = rooms[r].metadata;
        combo.capacity += md.capacity;
        combo.energy += md.energy;
        for (var i = 0; i < md.resources.length; i++) {
            var res = md.resources[i];
            if (res.resource in resourceMap) {
                var costs = resourceMap[res.resource]
                for (var j = 0; j < costs.length; j++) {
                    costs[j] += res.costs[j];
                }
            } else {
                resourceMap[res.resource] = res.costs.slice();
            }
        }
    }

    combo.resources = [];
    for (resource in resourceMap) {
        combo.resources.push({
            "resource": resource,
            "costs": resourceMap[resource]
        });
    }

    return combo;
}

function getErrorsWarningsAndCombinedMetadata(rooms) {
    var metadataCounts = {};

    for (var r = 0; r < rooms.length; r++) {
        if (!(rooms[r].metadata.id in metadataCounts)) {
            metadataCounts[rooms[r].metadata.id] = [rooms[r].metadata, 1];

        } else {
            metadataCounts[rooms[r].metadata.id][1] += 1;
        }
    }

    var errors = [];
    var warns = [];

    for (mdid in metadataCounts) {
        var roomTypeErrors = getNewRoomErrors(metadataCounts[mdid][0], metadataCounts[mdid][1]);
        if (roomTypeErrors) {
            addAllToListIfNotPresent(errors, roomTypeErrors);
        }
        var roomTypeWarns = getNewRoomWarnings(metadataCounts[mdid][0], metadataCounts[mdid][1]);
        if (roomTypeWarns) {
            addAllToListIfNotPresent(warns, roomTypeWarns);
        }
    }
    // the lazy way: just remove any energy and capacity errors we got from checking individual room types
    // these will be covered by the combined metadata check
    removeError(errors, "energy");
    removeError(errors, "capacity");

    var combinedMetaData = combineMetadata(rooms);

    var combinedErrors = getNewRoomErrors(combinedMetaData);
    if (combinedErrors) {
        addAllToListIfNotPresent(errors, combinedErrors);
    }
    var combinedWarns = getNewRoomWarnings(combinedMetaData);
    if (combinedWarns) {
        addAllToListIfNotPresent(warns, combinedWarns);
    }

    if (errors.length == 0) errors = null;
    if (warns.length == 0) warns = null;

    return { errors, warns, combinedMetaData };
}

//==============================================================
// overall bounds calculation and PNG generation
//==============================================================

class Position {
    constructor(mx, my, floor, rotation) {
		this.MX = mx;
		this.MY = my;
		this.Floor = floor;
		this.R = rotation;
    }

    toVect() {
        return new Vect(this.MX, this.MY);
    }

    equals(other) {
		return this.MX == other.MX
				&& this.MY == other.MY
				&& this.Floor == other.Floor
				&& this.R == other.R;
    }
}

class RoomPosition extends Position {
    constructor(room) {
        super(room.mv.x,
            room.mv.y,
            room.floor,
            room.rotation);
    }

    equals(other) {
		return this.MX == other.MX
				&& this.MY == other.MY
				&& this.Floor == other.Floor
				&& this.R == other.R;
    }
}

class DojoBounds {
	constructor(rooms = null) {
		this.x1 = 100000;
		this.x2 = -100000;
		this.y1 = 100000;
		this.y2 = -100000;
		this.f1 = 100000;
		this.f2 = -100000;
		this.floorCounts = {};
		this.center = null;
		if (rooms) {
		    this.includeRooms(rooms);
		}
	}
	
	includeAll() {
		for (var r = 0; r < roomList.length; r++) {
			this.includeRoom(roomList[r]);
		}
	}

	includeRooms(rooms) {
	    for (var r = 0; r < rooms.length; r++) {
	        this.includeRoom(rooms[r]);
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
			    if (!this.floorCounts[floors[f]]) this.floorCounts[floors[f]] = 0;
			    this.floorCounts[floors[f]] += 1;
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

    centerPosition() {
        if (!this.center) {
            // find the center and round to the nearest 1m
            var centerX = Math.round((this.x1 + this.x2) / 2);
            var centerY = Math.round((this.y1 + this.y2) / 2);
            // find the floor with the most rooms on it
            var floor = null;
            for (var f in this.floorCounts) {
                f = parseInt(f);
                if (floor == null || this.floorCounts[f] > this.floorCounts[floor]) {
                    floor = f;
                }
            }
            this.center = new Position(centerX, centerY, floor, 0);
        }
        return this.center;
    }
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
var labelData = null;

function convertFloorToPngLink(targets, db, margin, scale, f) {
	// calculate the point in the image that represents (0, 0) in meter-space
    var roomViewCenterPX = margin + (-db.x1 * scale);
    var roomViewCenterPY = margin + (-db.y1 * scale);

	var localDrawnImages = 0;
	drawnImages = 0;
	loadedImages = 0;
	loadedImageData = Array();
	labelData = Array();

	for (var r = 0; r < roomList.length; r++) {
		var room = roomList[r];
		// check if the room is visible on the given floor
		if (room.isVisible(f)) {
		    // check for a label
            if (room.label) {
                // start with the room's position
				var v = new Vect(room.mv.x, room.mv.y)
	                // scale by the scale, they are now pixel coords
	                .scale(scale)
	                // add to the center point
	                .addTo(roomViewCenterPX, roomViewCenterPY);
	            // scale font size
                var fontSize = 16;
				// calculate basis vectors starting from the transformed anchor point
        		labelData.push({
        		    "text": room.label,
        		    "x": v.x,
        		    "y": v.y,
        		    "fontSize": fontSize,
        		    "hue": room.hue,
        		    "scale": scale,
                });
            }

		    if (room.metadata.num == 0) {
		        // skip the rest if it's a special non-counting room
		        continue;
		    }

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
				imageLoaded(targets, db, margin, scale, f, index, {
				    "image": this,
				    "xx": vx.x,
				    "xy": vx.y,
				    "yx": vy.x,
				    "yy": vy.y,
				    "tx": av.x,
				    "ty": av.y,
				    "hue": room.hue
				});
            }
            img.src = "img" + imgScale + "x/" + room.getImageBase(f) + room.getDisplayImageSuffix();
			localDrawnImages++;

			// see if the room has any markers
			for (var m = 0; m < room.markers.length; m++) {
				var marker = room.markers[m];
				if (marker.floor != f) {
					continue;
				}
				// build an image link because that's what context.drawImage wants
                var img2 = new Image();
                // we have store parameters in the img object itself
                img2.index = localDrawnImages;
                img2.marker = marker;
	            // omg is this really the only reliable way to draw an image on a canvas?!
                img2.onload = function() {
	                var index = this.index;
                    var marker = this.marker;
					// the marker is a little simpler because we don't have to rotate it
					// start with the marker coords
					// it's also more complicated because we need its dimensions, which we don't have until it's loaded
					var av2 = marker.mv.copy()
		                // scale by the scale, they are now pixel coords
		                .scale(scale)
		                // add to the center point
		                .addTo(roomViewCenterPX, roomViewCenterPY)
		                // center the image
		                .addTo(-this.width * (scale / imgScale) / 2, -this.height * (scale / imgScale) / 2);

					// notify
					imageLoaded(targets, db, margin, scale, f, index, {
    					"image": this,
    					"xx": scale / imgScale,
    					"xy": 0,
    					"yx": 0,
    					"yy": scale / imgScale,
    					"tx": av2.x,
    					"ty": av2.y
					});
				}
	            img2.src = "img" + imgScale + "x/" + marker.metadata.image + ".png";
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

function imageLoaded(targets, db, margin, scale, f, index, imageData) {
	// todo: cancel if the menu has been closed before we're finished.

	// if there's an image
	if (imageData && imageData.image) {
		// increment our count and save the image + transform for later
		loadedImages++;
		loadedImageData[index] = imageData;
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
        context.setTransform(a.xx, a.xy, a.yx, a.yy, a.tx, a.ty);
        // set the hue rotation if there is one
        if (a.hue != null) {
            // todo: this is not supported of safari because of reasons
            context.filter = "hue-rotate(" + a.hue + "deg)";
        }
		// draw the image at the center of the new coordinate space
		context.drawImage(a.image, 0, 0);
		// reset the transform
		context.resetTransform();
		// reset the hue, if there is one
		if (a.hue != null) {
		    // you have to set it to "none"
            context.filter = "none";
		}
    }

    for (var i = 0; i < labelData.length; i++) {
        var a = labelData[i];
        // set the transform with the two basis vectors and the translate vector
        context.translate(a.x, a.y);
        context.scale(a.scale, a.scale);
		var fontSize = a.fontSize;
		// draw the image at the center of the new coordinate space
		var texts = a.text.split("\n");
        context.font = "bold " + fontSize + "px sans-serif";
        context.textAlign = "center";
		for (var t = 0; t < texts.length; t++) {
		    var y = (t - ((texts.length - 1)/2) + 0.5) * fontSize;
		    // poor man's text outline, this mirrors the only officially supported way to do it in css, so shrug.
            context.fillStyle = "#000000";
            context.fillText(texts[t], -1, y-1);
            context.fillText(texts[t], 1, y-1);
            context.fillText(texts[t], -1, y+1);
            context.fillText(texts[t], 1, y+1);

            context.fillStyle = a.hue != null ? ("hsl(" + a.hue + ", 75%, 75%)") : "#FFFFFF";
            context.fillText(texts[t], 0, y);
		}
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

//==============================================================
// Collision debug
//==============================================================

function findHighestFloor(room) {
    var ceil = 0;    
    for (var b = 0; b < room.bounds.length; b++) {
        var bounds = room.bounds[b];
        if (bounds.metadata.ceil > ceil) {
            ceil = bounds.metadata.ceil;
        }
    }
    return Math.floor((ceil - 1) / 64.0);
}

function findLowestFloor(room) {
    var floor = 0;    
    for (var b = 0; b < room.bounds.length; b++) {
        var bounds = room.bounds[b];
        if (bounds.metadata.floor < floor) {
            floor = bounds.metadata.floor;
        }
    }
    // any room with a floor level under -48 will block every room on the floor below it
    return Math.ceil((floor - 12) / 64.0);
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
        var tr = new Room(rmd1);
        var tro = findLowestFloor(tr);
		tdList.push(buildTh(rmd1.id + "<br/>(" + tro + ")"));
    }
	table.appendChild(buildTr(tdList));

    for (var r1 = 0; r1 < roomMetadataList.length; r1++) {
        tdList = Array();
        var rmd1 = roomMetadataList[r1];
        var lowerRoom = new Room(rmd1)
        var lowerRoomOffset = findHighestFloor(lowerRoom);
        var lowerDoor = lowerRoom.doors[0];
        lowerRoom.setPosition(-lowerDoor.metadata.x, -lowerDoor.metadata.y, 100-lowerRoomOffset, 0, updateFloors=false);

		tdList.push(buildTh(rmd1.id + " (" + lowerRoomOffset + ")"));

	    for (var r2 = 0; r2 < roomMetadataList.length; r2++) {
	        var rmd2 = roomMetadataList[r2];
	        var upperRoom = new Room(rmd2);
            var upperRoomOffset = findLowestFloor(upperRoom);
	        var upperDoor = upperRoom.doors[0];
            upperRoom.setPosition(-upperDoor.metadata.x, -upperDoor.metadata.y, 101-upperRoomOffset, 0, updateFloors=false);

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