// Sorry, this is Grade-A Fancy spaghetti code

//==============================================================
// Common functions
//==============================================================

// part types:
var part_bounds        = 1;
var part_display_other = 2;
var part_display       = 3;
var part_outline       = 4;
var part_marker        = 5;
var part_doormarker    = 7;
var part_label         = 8;
var part_debug         = 9;

// One function for handling all the z-index values for room images
function getZIndex(room, part) {
    if (room.isVisible()) {
        // If it's just bleeding into this floort then it goes just below.
        if (!room.isOnFloor()) return 10100 + part
        // otherwise everything on the current floor is on top
        else return 10200 + part;
    } else if (part == part_outline && (room.isSelected() || room.hasCollision())) {
        // for outlines, put the ones for selected/collided rooms on the top layer so we can see them all
        // everything else (rule errors, warnings) can be behind stuff.
        return 10200 + part;
    } else {
        // otherwise, there is a band of z-indexes for each floor's display layers
        return (100 * part_debug) + (room.floor * part_debug) + part;
    }
}

function getDisplayImageFilter(hue, visible=true) {
    // dim rooms setting
    if (settings.dimRooms) visible = false;
    // CSS filter value for the display image, if necessary
    return hue == null ? (visible ? "" : "brightness(25%") : (
        " hue-rotate(" + (hue[0] - 120) + "deg)" +
        " saturate(" + hue[1] * (visible ? 1 : 0.5) + "%)" +
        " brightness(" + hue[2] * (visible ? 1 : 0.25) + "%)");
}

function getDisplayLabelColor(hue, visible=true) {
    // CSS color value for the label, depending on whether there is a hue specified
    return hue == null ?
        (visible ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 10%)") :
        // HSL doesn't quite translate from HSV, take my best stab at a match
        (visible ?
            "hsl(" + hue[0] + ", " + (hue[1] * 0.50) + "%, " + (Math.min(hue[2]*0.50, 66)) + "%)" :
            "hsl(" + hue[0] + ", " + (hue[1] * 0.25) + "%, " + (Math.min(hue[2]*0.50, 66)*0.25) + "%)"
        );
}

function getDisplayLabelTextShadowColor(hue, visible=true) {
    // CSS color value for the label, depending on the hue and whether it's visible
    // basic rule: switch from black to white outline at 50% luminance
    return hue == null ? "#000" :
        hue[2] > 70 ? "#000" :
        visible ? "#dddddd" :
        "#333333";
}

function getDisplayLabelTextShadow(hue, visible=true) {
    // get the shadow color
    var color = getDisplayLabelTextShadowColor(hue, visible);
    // build the drop shadow CSS
    return "-1px -1px 0 " + color + ", 1px -1px 0 " + color + ", -1px 1px 0 " + color + ", 1px 1px 0 " + color;
}

//==============================================================
// data model serialization
//==============================================================

// needs to be a global regex so all occurrences are replaced
var quoteRegex = new RegExp('"', "g");
var newlineRegex = new RegExp('\n', "g");

function getRoomDoorFlags(room) {
    var hasFlags = false;
    for (var d = 0; d < room.doors.length; d++) {
        var door = room.doors[d];
        if (door.forceCrossBranch) {
            hasFlags = true;
            break;
        }
    }
    if (!hasFlags) {
        return null;
    }
    var flags = "";
    for (var d = 0; d < room.doors.length; d++) {
        if (d > 0) flags += ":";
        var door = room.doors[d];
        if (door.forceCrossBranch) {
            flags += "x";
        }
    }
    return flags;
}

function parseRoomDoorFlags(room, flagString) {
    var doorflags = flagString.split(":");
    for (var d = 0; d < room.doors.length && d < doorflags.length; d++) {
        var flags = doorflags[d];
        var door = room.doors[d];
        if (flags.includes("x")) {
            door.forceCrossBranch = true;
        }
    }
}

function roomToString(room, urlencode=false) {
    var s = room.metadata.id + "," + room.mv.x + "," + room.mv.y + "," + room.floor + "," + (room.rotation / 90)
    var flags = "";
    if (room.isSpawnPoint()) {
        flags = flags + "s";
    }
    var doorFlags = getRoomDoorFlags(room);

    // hue and label fields are optional
    if (flags != "" || doorFlags != null || room.hue != null || room.label != null) {
        // add the hue or blank if it's null
        s = s + "," + (room.hue == null ? "" : (room.hue[0] + ":" + room.hue[1] + ":" + room.hue[2]));
        // label is optional
        if (flags != "" || doorFlags != null || room.label != null) {
            // we just need to escape quotes, and then put it in quotes
            s = s + ',' + (room.label ? ('"' + (urlencode ? encodeURIComponent(room.label) : room.label).replace(quoteRegex, '\\"') + '"') : "");

            if (flags != "" || doorFlags != null || room.labelScale != 1) {
                s = s + ',' + (room.labelScale != 1 ? room.labelScale.toFixed(2) : "");

                if (flags != ""|| doorFlags != null) {
                    s = s + "," + flags;

                    if (doorFlags != null) {
                        s = s + "," + doorFlags;
                    }
                }
            }
        }
    }
    return s;
}

function roomFromString(string, readRooms) {
    // split by comma taking into account quotes, removing both commas and quotes
    var s = quotedSplit(string, ",");
    var mid = s[0];
    // migrate old single barracks rooms to a separate barracks room for each tier
    // just increment them in the order in which they appear in the saved room list
    if (mid == "b1") {
        // use the read room list to get the current highest tier barracks
        var tier = 0;
        for (var i = 0; i < readRooms.length; i++) {
            var roomTier = readRooms[i].metadata.tier;
            if (roomTier && roomTier > tier) {
                tier = roomTier;
            }
        }
        while (true) {
            // look for the barracks for the next tier up
            var newmd = roomMetadata.rooms.find(room => room.tier == tier + 1);
            if (newmd) {
                // found it
                console.log("Migration: replacing room " + mid + " with room " + newmd.id);
                mid = newmd.id;
                break;
            }
            // layout has too many barracks, decrease the tier until we find a matching barracks we can add
            tier--;
        }
    }
    var room = new Room(getRoomMetadata(mid));
    // room coordinates may be fractional because of old dojo rooms, floor and rotation are still ints
    room.setPosition(parseFloat(s[1]), parseFloat(s[2]), parseInt(s[3]), parseInt(s[4]) * 90);
    // look for optional hue
    if (s.length > 5) {
        // blank is null
        if (s[5].length > 0) {
            if (s[5].includes(":")) {
                var h = s[5].split(":");
                room.setHue([parseInt(h[0]), parseInt(h[1]), parseInt(h[2])]);
            } else {
                // backwards compatible with old format with just the hue
                // try to match saturation and brightness as close as possible
                room.setHue([parseInt(s[5]), 50, 100]);
            }
        }
        // look for optional label
        if (s.length > 6) {
            if (s[6].length > 0) {
                room.setLabel(s[6]);
            }

            // look for optional label size
            if (s.length > 7) {
                if (s[7].length > 0) {
                    room.setLabelScale(parseFloat(s[7]));
                }

                // look for optional flag field
                // how did it take me this long to add a generic flags field?
                if (s.length > 8) {
                    var flags = s[8];
                    if (flags.includes("s")) {
                        // go through the global method to set the spawn point to make sure there's only one
                        setSpawnPointRoom(room, false);
                    }
                    if (s.length > 9) {
                        var doorFlags = s[9];
                        parseRoomDoorFlags(room, doorFlags);
                    }
                }
            }
        }
    }
    return room;
}

function cleanseLabel(label) {
    if (!label || label.length == 0) {
        return label;
    }
    return label.replace(/</g, "&lt;");
}

function uncleanseLabel(label) {
    if (!label || label.length == 0) {
        return label;
    }
    return label.replace(/%lt;/g, "<");
}

//==============================================================
// Bound object
//==============================================================

class Bound {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;
        this.invisible = "true" == doorMetadata.invis;
        this.debugBorder = null;
        this.ignore = doorMetadata.ignore;

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
	    // easiest to iterate from the end backwards
	    for (var c = this.collisions.length - 1; c >= 0; c--) {
	        // remove everything except rooms in the same selection
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
			this.debugBorder.style.left = this.x1;
			this.debugBorder.style.top = this.y1;
			this.debugBorder.style.width = this.x2 - this.x1 - 2;
			this.debugBorder.style.height = this.y2 - this.y1 - 2;
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

        // outgoing flag for tree direction
        this.outgoing = false;

        // cocluated cross branch flag, pretty sure this isn't visible in the UI anymore
        this.crossBranch = false;
        // whether the door si forced to be cross branch
        this.forceCrossBranch = false;

        // looping flag
        this.looping = false;

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

	setForceCrossBranch(forceCrossBranch) {
	    // sanity check to make sure the door si connected
	    if (this.otherDoor) {
	        // make sure the flag matches on both sides of the door
	        this.forceCrossBranch = forceCrossBranch;
	        this.otherDoor.forceCrossBranch = forceCrossBranch;

	    } else if (!forceCrossBranch) {
	        // no other diir, just set this door's state
	        this.forceCrossBranch = false;
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

	connect(otherDoor) {
		if (this.otherDoor == otherDoor) {
			return;
		}

		if (this.otherdoor) {
			this.disconnectFrom(prevOtherDoor);
		}

        // sanity checks, this should only matter when loading a layout
		if (this.forceCrossBranch) {
		    otherDoor.forceCrossBranch = true;
		}

		this.otherDoor = otherDoor;
		this.otherDoor.connect(this);

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

        // reset state
        this.forceCrossBranch = false;
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
		var save = [this, this.otherDoor, this.forceCrossBranch];
		this.disconnectFrom(this.otherDoor);
		return save;
	}

	reconnect(save) {
		if (save[0] == this) {
			this.connect(save[1]);
			// restore state
			this.setForceCrossBranch(save[2]);
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder && !this.otherDoor && this.floor == viewFloor) {
            viewContainer.appendChild(this.debugBorder);
        }
        // show tree arrows if neessary
        this.showArrowMarker();
    }

    showDoorMarker() {
        // only mess with the marker if it's an unconnected door on the current floor
        if (this.floor == viewFloor && !this.otherDoor) {
            this.showMarker("marker-door");
        }
    }

    hideDoorMarker() {
        // revert to the tree arrows or nothing
        this.showArrowMarker();
    }

    showArrowMarker() {
        // goddamn this got complicated
        var base =
                   // no markers if the door is not visible or advanced structure mode is not enabled
                   this.otherDoor == null || this.floor != viewFloor || !settings.structureChecking ? null :
                   // cross branch takes precedence
                   this.forceCrossBranch ? "marker-door-force-cross-branch" :
                   // looping is the next more important
                   this.looping ? "marker-door-loop" :
                   // regular cross branch, pretty sure this doesn't happen anymore
                   this.crossBranch ? "marker-door-cross-branch" :
                   // regular outgoing
                   this.outgoing ? "marker-door-outgoing" :
                   // no flags, this room is probably disconnected
                   null;

        // show or clear the marker
        this.showMarker(base);
    }

    showMarker(base) {
        // check if we need to change marker state
        if (!this.marker || this.marker.base != base || !settings.showMapMarkers) {
            // clear the current marker if present
            if (this.marker) {
                this.marker.remove();
                this.marker = null;
            }

            // show a new marker iff show Markers is enabled
            if (base && settings.showMapMarkers) {
                // build and add marker element
                this.marker = this.room.addDisplayImage(".png", getZIndex(this.room, part_doormarker), base, true);
                // make sure the event handler will bring up the door menu when clicking on this image
                this.marker.door = this;
            }
        }

        // update the view if necessary
        if (this.marker) {
            this.updateView();
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = this.x1;
			this.debugBorder.style.top = this.y1;
			this.debugBorder.style.width = this.x2 - this.x1 - 2;
			this.debugBorder.style.height = this.y2 - this.y1 - 2;
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
	constructor(room, floor, metadata, condition=null) {
		this.room = room;
		this.metadataFloor = floor;
		this.metadata = metadata;
		this.condition = condition;
		this.marker = null;
	}

    updatePosition() {
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate((this.room.rotation + this.room.mdragOffsetRotation) % 360).add(this.room.mv);
        this.floor = this.room.floor + this.metadataFloor;
    }

    addDisplay(viewContainer) {
        // check to see if the marker is visible and the condition, if any, is true
        if (this.floor == viewFloor && (!this.condition || this.condition())) {
            if (!this.marker) {
                // create the marker if necessary
    	        this.marker = this.room.addDisplayImage(".png", getZIndex(this.room, part_marker) + (this.metadata.z != null ? this.metadata.z : 0), this.metadata.image, true);
    	        if (this.metadata.tree) {
    	            // hax for tree markers, ignore all clicks because some of them will extend beyond the bounds of their door
    	            this.marker.style.pointerEvents = "none";
    	            this.marker.style.touchEvents = "none";
    	        }
            } else {
                // re-add the marker
                viewContainer.appendChild(this.marker);
            }
        }
    }

    updateView() {
        if (this.marker) {
            var transform2 = this.room.getMarkerImageTransform(this.mv.x, this.mv.y, this.metadata, viewPX, viewPY, viewScale);
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
// Room object
//==============================================================

var roomIdCount = 0;
var defaultLabelSize = 16;

class Room {
    constructor(metadata) {
        this.mv = new Vect(0, 0);
        this.mdragOffset = new Vect(0, 0);
        this.mdragOffsetRaw = new Vect(0, 0);
        this.mdragOffsetRotation = 0;
        this.mrotationOffset = null;
        this.dragging = false;
        this.placed = false;
        this.spawn = false;

        this.ignoreRooms = null;

        this.metadata = metadata;
        // tree metadata
        this.treemetadata = metadata.treetype ? treeMetadata[metadata.treetype] : null;
        this.treeMarkerMetadata = null;
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
        this.labelScale = 1.0;

        this.selected = false;
        this.connected = false;
        this.looped = false;

        this.hue = null;
        // pull default label from metadata, if present
        this.label = this.metadata.defaultLabel ? this.metadata.defaultLabel : null;

        this.calculateAnchor();
        this.ruleErrors = Array();
        this.ruleWarnings = Array();
    }

    setSpawnPoint(isSpawnPoint) {
        if (isSpawnPoint != this.spawn) {
            if (isSpawnPoint) {
                // appears on floor 0 relative to the room's base floor
                var spawnMarker = new Marker(this, 0, spawnMarkerMetadata);
                this.markers.push(spawnMarker);
                // this can be set before the room is actually displayed
                if (this.viewContainer) {
                    // have to update position first
                    spawnMarker.updatePosition();
                    spawnMarker.addDisplay(this.viewContainer);
                    spawnMarker.updateView();
                }
                this.spawn = true;
            } else {
                var index = this.markers.findIndex((marker) => marker.metadata == spawnMarkerMetadata);
                if (index != -1) {
                    var spawnMarker = this.markers[index];
                    this.markers.splice(index, 1);
                    if (this.viewContainer) {
                        spawnMarker.removeDisplay(this.viewContainer);
                    }
                }
                this.spawn = false;
            }
        }
    }

    isSpawnPoint() {
        return this.spawn;
    }

    refreshMarkers() {
        // super damn hack
        for (var m = 0; m < this.markers.length; m++) {
            var marker = this.markers[m];
            if (marker.condition) {
                if (marker.condition()) {
                    marker.updatePosition();
                    marker.addDisplay(this.viewContainer);
                    marker.updateView();
                } else if (marker.marker) {
                    marker.marker.remove();
                }
            }
        }
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
		if (addToListIfNotPresent(this.ruleWarnings, rule)) {
			this.checkErrors();
			this.updateView();
		}
	}

	removeRuleWarning(rule) {
		if (removeFromList(this.ruleWarnings, rule)) {
			this.checkErrors();
			this.updateView();
		}
	}

	removeAllRuleErrors(checkErrors=true) {
		if (this.ruleErrors.length > 0) {
			removeFloorError(this.floor, this);
			if (checkErrors) {
                this.checkErrors();
                this.updateView();
			}
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

    getSomeWarnings() {
		if (this.ruleWarnings.length == 0) return null;
		if (this.ruleWarnings.length == 1 && this.ruleWarnings[0] == "Discontinued room") return null;
		return this.ruleWarnings;
    }

	dispose() {
		this.removeAllRuleErrors(false);
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
        // check for cached result
        if (this.allFloors) {
            return this.allFloors;
        }

        if (!this.metadata.floor_images || this.metadata.floor_images.length == 1) {
            // simple case, room is only on one floor
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
            // floor has changed, reset any cached floor result
            this.allFloors = null;
        }
        this.floor = nf;
        this.rotation = nr;

        // only bother if it's a full update
        // non-full updates are used mostly in clone/copy/paste, we don't need
        // to do any of these updates in those cases
        if (fullUpdate) {
    		this.updateMarkerPositions();
    		// this needs to be before addDisplay() so the room knows what floor(s) it's on
            this.updateDoorPositions();
            this.updateBoundsPositions();

            if (isNewFloor) {
                this.removeDisplay();
                this.addDisplay(getRoomContainer());
                this.reAddAllRuleErrors();
            }
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
                    // don't chack collisions with rooms in the same selection
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

        // update debug bounds views, if present
        // need to do this here because we're no longer updating each room's
        // view when moving around
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].updateView();
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

    hasCollision() {
        for (var b = 0; b < this.bounds.length; b++) {
            var bound = this.bounds[b];
	        if (bound.collisions.length > 0) {
	            return true;
	        }
        }
        return false;
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
			        this.grid = this.addDisplayImage("-bounds-blue.png", getZIndex(this, part_bounds));
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
        // we don't want to show the outline when it's just a discontinued room, that's annoying
        var warnings = this.getSomeWarnings();
 		if (errors || warnings) {
 		    // check the showAllFloors setting if this room is not visible on the current floor
			if (this.viewContainer && (this.isVisible() || settings.showAllFloors)) {
				if (!this.outline) {
			        this.outline = this.addDisplayImage("-line-blue.png", getZIndex(this, part_outline));
				}
				var hueRotate = errors ? 120 : 180;

			    if (this.isSelected()) {
				    this.outline.style.filter = errors ?
				        "hue-rotate(120deg) saturate(150%) brightness(250%)" :
				        "hue-rotate(180deg) saturate(200%) brightness(400%)";

			    } else if (this.isVisible()) {
				    this.outline.style.filter = errors ?
				        "hue-rotate(120deg)" :
				        "hue-rotate(180deg) saturate(200%) brightness(250%)";

			    } else {
//			        this.outline = this.removeDisplayElement(this.outline);
				    this.outline.style.filter = errors ?
				        "hue-rotate(120deg) saturate(150%) brightness(25%)" :
				        "hue-rotate(180deg) saturate(200%) brightness(100%)";
//				    return false;
			    }
			}
		    return true;

		} else if (this.isSelected()) {
			if (!this.outline) {
		        this.outline = this.addDisplayImage("-line-blue.png", getZIndex(this, part_outline));
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
	        this.outline = this.addDisplayImage("-line-blue.png", getZIndex(this, part_outline));
        }
        if (!this.grid) {
	        this.grid = this.addDisplayImage("-bounds-blue.png", getZIndex(this, part_bounds));
        }
		// see if the outline should be red
	    this.checkCollided();
	    this.checkErrors();
	    // todo: why is this here?
        this.updateView();
    }

    deselect() {
        this.selected = false;
        if (!this.checkErrors() || (!this.isVisible() && !settings.showAllFloors)) {
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
        // increment the rotation
        var newRotation = (this.mdragOffsetRotation + 90) % 360;
        // get a vector pointing from the center of rotation to our untransformed position
        // and rotate
        var fromCenter = this.mv.subtract(centerM).rotate(newRotation);
        // add the new vector to the center to get our new position, and subtract our
        // current untransformed position to get the delta
        // save to the special rotation offset vector
        var rotationOffsetM = fromCenter.add(centerM).subtract(this.mv);
        // rotate as normal, but with an additional offset
        this.rotate(rotationOffsetM);
    }

    rotate(rotationOffsetM = null) {
        // if we're currently dragging
        if (this.dragging) {
            // save as a special offset that will get added to the normal drag offset
            this.mrotationOffset = rotationOffsetM;
            // go through the drag offset update
	        this.setDragOffset(null, null, (this.mdragOffsetRotation + 90) % 360);

        // not dragging, rotate the room in place
        } else {
            // disconnect
		    this.disconnectAllDoors(this.rooms);
		    // move directly to the new rotated position, using the rotation offset if provided
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
                // don't disconect doors with rooms in the same selection
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

    getConnectedRooms() {
        var rooms = [];
        for (var d = 0; d < this.doors.length; d++) {
            var od = this.doors[d].otherDoor;
            if (od) {
                rooms.push(od.room);
            }
        }
        return rooms;
    }

    setMDragOffset(offsetX, offsetY) {
        // we need the original raw drag offset so rooms can be rotated without
        // waiting for another drag event
        this.mdragOffsetRaw.set(offsetX, offsetY);
        // apply the rotation offset, if present
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

        // update display
        this.setDraggingDisplay();

        if (offsetMX != null) {
            // update the drag offset if there is an updated value
            this.setMDragOffset(offsetMX, offsetMY);
        }
        if (offsetRotation != null) {
            // update the rotation if there is an updated value
            this.mdragOffsetRotation = offsetRotation;
            if (this.mrotationOffset) {
                // update the drag offset if the rotation offset was also updated
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
        // has to be reset separately
        this.mrotationOffset = null;
        // go through the normal method to reset everything else
        this.setDragOffset(0, 0, 0, true);
    }

    // get the closest door pair to smap together, if there is one
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
        // check if either this is a new room or if we actually dragged anywhere
        if (!this.placed || this.mdragOffset.x != 0 || this.mdragOffset.y!= 0 || this.mdragOffsetRotation != 0) {
            // calculate the new position
            var nmv = this.mv.add(this.mdragOffset);
			var nr = (this.rotation + this.mdragOffsetRotation) % 360;

            // so much drag state to reset
            // do this directly instead of through resetDragOffset() to save a few useless steps
            this.mdragOffset.set(0, 0);
            this.mdragOffsetRaw.set(0, 0);
            this.mdragOffsetRotation = 0;
            this.mrotationOffset = null;

	        // commit the position change
            this.setPositionAndConnectDoors(nmv.x, nmv.y, this.floor, nr);

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

    setLabel(label) {
        // treat blank as null
        if (label != null && label.length == 0) {
            label = null;
        }
        label = cleanseLabel(label);
        // check for change
        if (label != this.label) {
            // set the label, taking into account the metadata's default if there is one
            this.label = label ? label : this.metadata.defaultLabel ? this.metadata.defaultLabel : null;
            // update the display
            this.updateLabelDisplay();
            this.updateView();
        }
    }

    setLabelScale(labelScale) {
        // check for change
        if (labelScale != this.labelScale) {
            this.labelScale = labelScale ? labelScale : 1.0;
            // update the display
            this.updateLabelDisplay();
            this.updateView();
        }
    }

    getLabelScale() {
        return this.label ? this.labelScale : null;
    }

    setHue(hue, override=null) {

        // check for change
        if (!arrayEquals(hue, this.hue)) {
            // if it's changing from null to not null or vice versa then we will need
            // to reset the display to use a different image
            var reset = hue == null || this.hue == null;
            // set the new value
            if (override && this.hue && hue) {
                // only override certain parts of the color
                this.hue = [
                    override[0] ? hue[0] : this.hue[0],
                    override[1] ? hue[1] : this.hue[1],
                    override[2] ? hue[2] : this.hue[2]
                ];
            } else {
                this.hue = hue;
            }
            // reset the display if necessary
            if (reset) {
                this.resetColorDisplay();
            }
            if (this.display) {
                // update or clear the hue filter
                this.display.style.filter = getDisplayImageFilter(this.hue, true);
            } else if (this.otherFloorDisplay) {
                // update or clear the hue filter
                this.otherFloorDisplay.style.filter = getDisplayImageFilter(this.hue, false);
            }
			// if there is a label then update its filter, too
			if (this.labelDisplay) {
			    this.labelDisplay.style.color = getDisplayLabelColor(this.hue, this.isVisible());
			    this.labelDisplay.style.textShadow = getDisplayLabelTextShadow(this.hue, this.isVisible());
			}
        }
    }

    updateLabelDisplay() {
        if (this.label && settings.showLabels && (this.isVisible() || settings.showAllFloors)) {
            if (!this.labelDisplay) {
                // we need a label for don't have one, create it
	            this.labelDisplay = this.addDisplayLabel(getZIndex(this, part_label));
	            // init the hue filter, if there is one
			    this.labelDisplay.style.color = getDisplayLabelColor(this.hue, this.isOnFloor());
                this.labelDisplay.style.textShadow = getDisplayLabelTextShadow(this.hue, this.isOnFloor());
            }
            // update the label contents, replacing newlines with <br/>
            this.labelDisplay.innerHTML = this.label.replace(newlineRegex, "<br/>");

        } else if (this.labelDisplay) {
            // we have a label and don't need it anymore, remove it.
            this.labelDisplay = this.removeDisplayElement(this.labelDisplay);
        }
    }

    resetColorDisplay() {
        // remove the old display image
        if (this.display) {
            this.display.remove();
            this.display = null;
        }
        if (this.otherFloorDisplay) {
            this.otherFloorDisplay.remove();
            this.otherFloorDisplay = null;
        }
        if (viewFloor != null) {
            if (this.isVisible()) {
                // create a new display image, either grayscale or with color
                this.display = this.addDisplayImage(this.getDisplayImageSuffix(), getZIndex(this, part_display));
                // set the hue filter, if any
                this.display.style.filter = getDisplayImageFilter(this.hue, true);
            } else {
                this.otherFloorDisplay = this.addDisplayImage(this.getDisplayImageSuffix(), getZIndex(this, part_display));
                this.otherFloorDisplay.style.filter = getDisplayImageFilter(this.hue, false);
            }
            // init the display's position, rotation, etc
            this.updateView();
        }
    }

    // TREE STUFF
    showTree() {
        // refresh door markers
		for (var d = 0; d < this.doors.length; d++) {
			this.doors[d].showArrowMarker();
        }

        // check tree metadata, every room has this now
        if (this.treemetadata) {
            // remove markers if adcanced mode is turned off, or if this room
            // is disconnected or looped
            if (!settings.structureChecking || !this.connected || this.looped) {
                this.removeTreeMarkers();

            } else {
                // make a list of markers to display, this will be compared
                // against the current set of markers and only the differences
                // changed so we don't have flickering everywhere
                var keepMarkers = [];
                // build a door key, go down the door list and add a "1" for every
                // connected door and a "0" for disconnected doors.
                var doorKey = "";
                for (var d = 0; d < this.doors.length; d++) {
                    var door = this.doors[d];
                    // filter out doors that are connected to non-traversible rooms like labels
                    doorKey += (door.otherDoor && !door.crossBranch && isTraversableRoom(door.otherDoor.room)) ? "1" : "0";
                }
                // check if the metadata has a door key conversion function
                if (this.treemetadata.convertKey) {
                    // call the function
                    var doorKeys = this.treemetadata.convertKey(doorKey);
                    // console.log("Key: " + doorKey + " => " + doorKeys);
                } else {
                    // otherwise, we just have the one door key
                    var doorKeys = [doorKey];
                }
                // loop over the door keys
                for (var i = 0; i < doorKeys.length; i++) {
                    // get the relevent tree metadata, there should be one of these
                    // for every door configuration
                    var treeMarkerMetadata = this.treemetadata[doorKeys[i]];
                    if (treeMarkerMetadata) {
                        // don't delete this marker in removeTreeMarkers() below
                        keepMarkers.push(treeMarkerMetadata);
                        // check if the marker is already present
                        if (this.markers.findIndex((marker) => marker.metadata == treeMarkerMetadata) != -1) {
                            // we already have this marker
                            continue;
                        }
                        // build a new marker, with optional floor info
                        var treeMarker = new Marker(this, treeMarkerMetadata.floor ? treeMarkerMetadata.floor : 0, treeMarkerMetadata);
                        // add the marker
                        this.markers.push(treeMarker);
                        // this can be set before the room is actually displayed
                        if (this.viewContainer) {
                            // have to update position first
                            treeMarker.updatePosition();
                            treeMarker.addDisplay(this.viewContainer);
                            treeMarker.updateView();
                        }
                    }
                }
            }
            // remove any other markers
            this.removeTreeMarkers(keepMarkers);
        }
    }

    removeTreeMarkers(except=null) {
        // remove any markers with the tree flag and whose metadata does not appear
        // in the given list
        for (var m = 0; m < this.markers.length; m++) {
            var marker = this.markers[m];
            if (marker.metadata.tree && (!except || !except.includes(marker.metadata))) {
                if (this.viewContainer) {
                    marker.removeDisplay(this.viewContainer);
                }
                // remove this entry and reset the index
                this.markers.splice(m, 1);
                m -= 1;
            }
        }
    }

    getDisplayImageSuffix() {
        // we need to use a different display image depending in whether
        // it's in color or not
        // this wouldn't be necessary if CSS had a way to directly filter the
        // red, green, and blue channels of an image
        return this.hue != null ? "-display-red.png" : "-display.png";
    }

    addDisplay(viewContainer) {
        this.viewContainer = viewContainer;
        if (this.isVisible()) {
            // main visible display
	        this.display = this.addDisplayImage(this.getDisplayImageSuffix(), getZIndex(this, part_display));
	        // init the display hue filter, if necessary
			this.display.style.filter = getDisplayImageFilter(this.hue, true);
	        if (this.isOnFloor()) {
                // init the label, if necessary
                this.updateLabelDisplay();

	        } else {
	            // additional other floor display
		        this.otherFloorDisplay = this.addDisplayImage(this.getDisplayImageSuffix(), getZIndex(this, part_display_other), this.getImageBase(this.floor));
			    this.otherFloorDisplay.style.filter = getDisplayImageFilter(this.hue, false);
                // init the label, if necessary
                this.updateLabelDisplay();
	        }
	        // check the showMapMarkers setting
	        if (settings.showMapMarkers) {
	            this.showMarkers();
	        }
			for (var b = 0; b < this.doors.length; b++) {
				this.doors[b].addDisplay(viewContainer);
			}
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].addDisplay(viewContainer);
			}

        // check the showAllFloors setting if this room is not visible on the current floor
        } else if (settings.showAllFloors) {
	        // just the other floor display
	        this.otherFloorDisplay = this.addDisplayImage(this.getDisplayImageSuffix(), getZIndex(this, part_display));
		    this.otherFloorDisplay.style.filter = getDisplayImageFilter(this.hue, false);
            // init the label, if necessary
            this.updateLabelDisplay();
        }

		this.checkCollided();
	    this.checkErrors();
        this.updateView();
    }

    showMarkers() {
        // room markers
        for (var m = 0; m < this.markers.length; m++) {
            this.markers[m].addDisplay(this.viewContainer);
        }
        // door markers
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].showArrowMarker();
        }
    }

    hideMarkers() {
        // room markers
        for (var m = 0; m < this.markers.length; m++) {
            this.markers[m].removeDisplay();
        }
        // door markers
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].showArrowMarker();
        }
    }

    addDisplayImage(imageSuffix, zIndex, imageBase = null, marker = false) {
        if (!imageBase) {
            imageBase = this.getImageBase();
        }
        if (!imageBase) {
            return null;
        }
        // Ugh, have to build the <img> element the hard way
        var element = document.createElement("img");
        // nice to track what kind of image it is
        element.base = imageBase;
        if (!marker) {
	        // Need to explicitly set the transform origin for off-center rooms
	        element.style.transformOrigin = (-this.anchorMX * imgScale) + "px " + (-this.anchorMY * imgScale) + "px";
        }
        element.src = "img" + imgScale + "x/" + imageBase + imageSuffix;
        // console.log("Adding for " + this.id + ": " + element.src);
        // if (element.src.endsWith("dry-dock-line-blue.png")) {
        //     console.trace();
        // }

        return this.addDisplayImageElement(element, zIndex);
    }

    addDisplayLabel(zIndex) {
        // labels should appear above all other elements
        // labels are just a div with CSS
        var element = document.createElement("div");
        element.className = "roomLabel";

        // add as a display element
        return this.addDisplayImageElement(element, zIndex);
    }

    addDisplayImageElement(element, zIndex) {
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
		// leave this set so we can add outlines and stuff when ShowAllFloors is unset
//        this.viewContainer = null;
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
            // update the three images, whichever ones are present
            if (this.display) {
				this.updateViewElement(this.display, transform);
                // update these only if there's a legit display
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
            if (this.outline) {
				this.updateViewElement(this.outline, transform);
            }
            if (this.grid) {
				this.updateViewElement(this.grid, transform);
            }
	        if (this.otherFloorDisplay) {
				this.updateViewElement(this.otherFloorDisplay, transform);
            }
        }
        // update label, if present
        if (this.labelDisplay) {
            this.updateLabelView();
        }
    }

    updateLabelView() {
        var transform = this.getLabelTransform(viewPX, viewPY, viewScale);
        this.updateViewElement(this.labelDisplay, transform);
    }

	getImageTransform(viewPX, viewPY, viewScale) {
        // transform the anchor coords to pixel coords
		var roomViewCenterPX = this.mv.x + this.mdragOffset.x;
		var roomViewCenterPY = this.mv.y + this.mdragOffset.y;
		var roomRotation = (this.rotation + this.mdragOffsetRotation) % 360;
		// we have to add the anchor points scaled by the image scale rather than the view scale in order for the
		// css transform to put the room in the right place.  so much trial and error to get this rght...
        var roomViewPX = roomViewCenterPX + (this.anchorMX * imgScale);
        var roomViewPY = roomViewCenterPY + (this.anchorMY * imgScale);

		// final scaling of the image
		var scale = 1 / imgScale;

	    // https://www.w3schools.com/cssref/css3_pr_transform.asp
	    // translate() need to be before rotate() and scale()
		return "translate(" + roomViewPX + "px, " + roomViewPY + "px) rotate(" + roomRotation + "deg) scale(" + scale + ", " + scale + ")";
	}

	getLabelTransform(viewPX, viewPY, viewScale) {
        // transform the center coords to pixel coords
		var roomViewCenterPX = this.mv.x + this.mdragOffset.x;
		var roomViewCenterPY = this.mv.y + this.mdragOffset.y;

//		// raw scaling
		var scale = this.labelScale;

        // no rotation, labels are always right-side-up

	    // https://www.w3schools.com/cssref/css3_pr_transform.asp
	    // translate() need to be before scale()
		return "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%) scale(" + scale + ", " + scale + ")";
	}

	getMarkerImageTransform(mx, my, metadata, viewPX, viewPY, viewScale) {
        // transform the marker center coords to pixel coords
		var roomViewCenterPX = mx + this.mdragOffset.x;
		var roomViewCenterPY = my + this.mdragOffset.y;

		// final scaling of the image
		var scale =  1/ imgScale;

		// translate by the pixel coords, and then back by 50% to center the image
		var transform = "translate(" + roomViewCenterPX + "px, " + roomViewCenterPY + "px) translate(-50%, -50%)";

        // check for optional rotation
		if (metadata.rot != null) {
		    // combine all relevant rotations
    		var rotation = (this.rotation + this.mdragOffsetRotation + metadata.rot) % 360;
            // add the transform
    		transform += " rotate(" + rotation + "deg)";
		}
		// check for flip
		if (metadata.fx || metadata.fy) {
            // apply scale and flip
            transform += "scale(" + (metadata.fx ? scale*-1 : scale) + ", " + (metadata.fy ? scale*-1 : scale) + ")";
		} else {
            // just apply scale
            transform += "scale(" + scale + ", " + scale + ")";
		}
		return transform;
	}

	getDoorMarkerImageTransform(mx, my, rotation, viewPX, viewPY, viewScale) {
        // doors' coordinates already include the room's offset
		var roomViewCenterPX = mx;
		var roomViewCenterPY = my;

		// final scaling of the image
		var scale = 1 / imgScale;

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

    toShortString() {
        return this.metadata.id + ":" + this.id;
    }
}

//==============================================================
// Room utils
//==============================================================

function cloneRooms(rooms, reposition=true) {
    // reposition when cloning existing rooms to put on our clipboard,
    // but not when cloning the clipboard to paste back in
    if (reposition) {
        // find the center room
        var centerRoom;
        if (rooms.length == 1) {
            // easy case with one room
            centerRoom = rooms[0];

        } else {
            // find the center point
            var center = new DojoBounds(rooms).centerPosition().toVect();
            // find the room closest to the center point
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

    // cloned rooms go in here
    var newRooms = [];

    for (var r = 0; r < rooms.length; r++) {
        var room = rooms[r];
        // create a new room of the same type
        var newRoom = new Room(room.metadata)
        if (reposition) {
            // set this room's relative position so the center room ends up at the origin on the floor 0
            newRoom.setPosition(
                room.mv.x - centerRoom.mv.x,
                room.mv.y - centerRoom.mv.y,
                room.floor - viewFloor,
                room.rotation, false, false);
            if (room == centerRoom) {
                // this is the center room on the clone side
                newCenterRoom = newRoom;
            }
        } else {
            // otherwise just clone the position
            newRoom.setPosition(
                room.mv.x,
                room.mv.y,
                room.floor,
                room.rotation, false, false);
        }
        // clone misc properties
        newRoom.label = room.label;
        newRoom.labelScale = room.labelScale;
        newRoom.hue = room.hue;
        // Do not clone spawn or door properties
        // add the new room
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
    // construct a synthetic metadata entry
    var combo = {};
    // use an id that won't match any room-specific rules
    combo.id = "multi";
    combo.name = rooms.length + " Rooms";
    // start at zero
    combo.capacity = 0;
    combo.energy = 0;
    // magic num property.  this tells some rules that this metadata actually counts as multiple rooms
    combo.num = rooms.length;

    // build up a resource map to combine resources
    var resourceMap = {};

    for (var r = 0; r < rooms.length; r++) {
        var md = rooms[r].metadata;
        // add capacity and energy
        combo.capacity += md.capacity;
        combo.energy += md.energy;
        for (var i = 0; i < md.resources.length; i++) {
            var res = md.resources[i];
            // check if teh resource is already in the map
            if (res.resource in resourceMap) {
                // pull the current total costs
                var costs = resourceMap[res.resource]
                // add the cost array from this room
                for (var j = 0; j < costs.length; j++) {
                    costs[j] += res.costs[j];
                }
            } else {
                // clone this room's cost array as the starting point for this resource
                resourceMap[res.resource] = res.costs.slice();
            }
        }
    }

    // metadata needs things in an array of structs, I don't feel like changing the format
    combo.resources = [];
    for (resource in resourceMap) {
        // convert to array of structs
        combo.resources.push({
            "resource": resource,
            "costs": resourceMap[resource]
        });
    }

    // that was an ordeal
    return combo;
}

function removeError(errors, error) {
    // remove any errors containing the given substring, case-insensitive
	if (errors) {
	    var re = new RegExp(error, "i");
	    removeMatchesFromList(errors, (err) => err.search(re) > -1)
	}
	return errors;
}

function getErrorsWarningsAndCombinedMetadata(rooms) {
    // keep a count of how many of each room type there are, along with the metadata itself
    // this is a map of id => [metadata, count]
    var metadataCounts = {};

    for (var r = 0; r < rooms.length; r++) {
        if (!(rooms[r].metadata.id in metadataCounts)) {
            // start a new entry
            metadataCounts[rooms[r].metadata.id] = [rooms[r].metadata, 1];

        } else {
            // increment the existing entry
            metadataCounts[rooms[r].metadata.id][1] += 1;
        }
    }

    var errors = [];
    var warns = [];

    // loop over room types
    for (mdid in metadataCounts) {
        // get errors from adding that many of this room type
        var roomTypeErrors = getNewRoomErrors(metadataCounts[mdid][0], metadataCounts[mdid][1]);
        if (roomTypeErrors) {
            // add any new errors to the error list
            addAllToListIfNotPresent(errors, roomTypeErrors);
        }
        // get warnings from adding that many of this room type
        var roomTypeWarns = getNewRoomWarnings(metadataCounts[mdid][0], metadataCounts[mdid][1]);
        if (roomTypeWarns) {
            // add any new warns to the warn list
            addAllToListIfNotPresent(warns, roomTypeWarns);
        }
    }
    // the lazy way: just remove any energy and capacity errors we got from checking individual room types
    // these could be erroneous if the room list includes room types with both positive and negative values for these
    // this error type will be checked by running the combined metadata
    removeError(errors, "energy");
    removeError(errors, "capacity");

    // combine the metadata
    var combinedMetaData = combineMetadata(rooms);

    // get errors from the combined metadata
    var combinedErrors = getNewRoomErrors(combinedMetaData);
    if (combinedErrors) {
        // add any new errors to the error list
        addAllToListIfNotPresent(errors, combinedErrors);
    }
    // get warns from the combined metadata
    var combinedWarns = getNewRoomWarnings(combinedMetaData);
    if (combinedWarns) {
        // add any new warns to the warn list
        addAllToListIfNotPresent(warns, combinedWarns);
    }

    // convention is to return null if there are no errors/warnings
    if (errors.length == 0) errors = null;
    if (warns.length == 0) warns = null;

    // return multiple values
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

function buildImageData(image, anchor, mv, rotation, scale, layer, roomViewCenterPX, roomViewCenterPY, hue=null) {
    // start by putting the anchor into a vect in world coords
    var av = anchor.rotate(rotation)
        // add to the position
        .add(mv)
        // scale by the scale, they are now pixel coords
        .scale(scale)
        // add to the center point
        .addTo(roomViewCenterPX, roomViewCenterPY);

    // calculate basis vectors starting from the transformed anchor point
    // use the anchor point as a hack to determine if the basis should be flipped across the x and/or y axis
    var vx = new Vect((anchor.x < 0 ? 1 : -1) * scale / imgScale, 0).rotate(rotation);
    var vy = new Vect(0, (anchor.y < 0 ? 1 : -1) * scale / imgScale).rotate(rotation);

    return {
        "image": image,
        "xx": vx.x,
        "xy": vx.y,
        "yx": vy.x,
        "yy": vy.y,
        "tx": av.x,
        "ty": av.y,
        "hue": hue,
        "layer": layer
    };
}

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
            if (room.label && room.isOnFloor(f) && settings.showLabels) {
                // start with the room's position
				var v = new Vect(room.mv.x, room.mv.y)
	                // scale by the scale, they are now pixel coords
	                .scale(scale)
	                // add to the center point
	                .addTo(roomViewCenterPX, roomViewCenterPY);
	            // scale font size
				// calculate basis vectors starting from the transformed anchor point
        		labelData.push({
        		    "text": room.label,
        		    "x": v.x,
        		    "y": v.y,
        		    "fontSize": defaultLabelSize,
        		    "hue": room.hue,
        		    "scale": scale * room.labelScale,
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

				// notify
				imageLoaded(targets, db, margin, scale, f, index, buildImageData(
                    this,
                    // anchor point in world coords
                    new Vect(room.anchorMX, room.anchorMY),
                    // translation
                    room.mv,
                    // rotation
                    room.rotation,
                    // scale
                    scale,
                    // layer
                    !room.isOnFloor(f) ? 0 : 1,
                    roomViewCenterPX, roomViewCenterPY,
                    room.hue
                ));
            }
            img.src = "img" + imgScale + "x/" + room.getImageBase(f) + room.getDisplayImageSuffix();
			localDrawnImages++;

            // check the ShowMapMarkers setting
            if (settings.showMapMarkers) {
                // see if the room has any markers
                for (var m = 0; m < room.markers.length; m++) {
                    var marker = room.markers[m];
                    // check the floor
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

                        // notify
                        imageLoaded(targets, db, margin, scale, f, index, buildImageData(
                            this,
                            // anchor point in world coords
                            new Vect(
                                (this.width / (2*imgScale)) * (marker.metadata.fx ? 1 : -1),
                                (this.height / (2*imgScale)) * (marker.metadata.fy ? 1 : -1)
                            ),
                            // translation
                            marker.mv,
                            // rotation
                            marker.metadata.rot == null ? 0 : (marker.room.rotation + marker.metadata.rot) % 360,
                            // scale
                            scale,
                            // layer
                            2 + (marker.metadata.z ? marker.metadata.z : 0),
                            roomViewCenterPX, roomViewCenterPY
                        ));
                    }
                    img2.src = "img" + imgScale + "x/" + marker.metadata.image + ".png";
                    localDrawnImages++;
                }
                for (var d = 0; d < room.doors.length; d++) {
                    if (room.doors[d].marker) {
                        var door = room.doors[d];
                        // check the floor
                        if (door.floor != f) {
                            continue;
                        }
                        // build an image link because that's what context.drawImage wants
                        var img2 = new Image();
                        // we have store parameters in the img object itself
                        img2.index = localDrawnImages;
                        img2.door = door;
                        // omg is this really the only reliable way to draw an image on a canvas?!
                        img2.onload = function() {
                            var index = this.index;
                            var door = this.door;

                            // notify
                            imageLoaded(targets, db, margin, scale, f, index, buildImageData(
                                this,
                                // anchor point in world coords
                                new Vect(-this.width / (2*imgScale), -this.height / (2*imgScale)),
                                // translation
                                door.mv,
                                // rotation
                                door.rotation,
                                // scale
                                scale,
                                // layer
                                4,
                                roomViewCenterPX, roomViewCenterPY
                            ));
                        }
                        img2.src = "img" + imgScale + "x/" + door.marker.base + ".png";
                        localDrawnImages++;
                    }
                }
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

    function drawImages(layer) {
        for (var i = 0; i < loadedImageData.length; i++) {
            var a = loadedImageData[i];
            if (a.layer != layer) {
                continue;
            }
            // set the transform with the two basis vectors and the translate vector
            context.setTransform(a.xx, a.xy, a.yx, a.yy, a.tx, a.ty);
            // set the hue rotation if there is one
            if (a.hue != null) {
                // todo: this is not supported of safari because of reasons
                context.filter = getDisplayImageFilter(a.hue);
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
    }

    var minLayer = 1000;
    var maxLayer = 0;
    for (var i = 0; i < loadedImageData.length; i++) {
        if (loadedImageData[i].layer > maxLayer) maxLayer = loadedImageData[i].layer;
        if (loadedImageData[i].layer < minLayer) minLayer = loadedImageData[i].layer;
    }

    for (var l = minLayer; l <= maxLayer; l++) {
        drawImages(l);
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
            context.fillStyle = getDisplayLabelTextShadowColor(a.hue);
            context.fillText(texts[t], -1, y-1);
            context.fillText(texts[t], 1, y-1);
            context.fillText(texts[t], -1, y+1);
            context.fillText(texts[t], 1, y+1);

            context.fillStyle = getDisplayLabelColor(a.hue);
            context.fillText(texts[t], 0, y);
		}
		// reset the transform
		context.resetTransform();
    }

	var floorName = getFloorName(f);

    // set up the title text
    context.font = (defaultLabelSize * scale) + "px Arial";
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