class Bound {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;
        this.debugBorder = null;
    }

    updatePosition() {
        // rotate the bound corners and translate by the room position
        var rotation = this.room.rotation;
        var mv1 = new Vect(this.metadata.x1, this.metadata.y1).rotate(rotation).add(this.room.mv).add(this.room.mdragOffset);
        var mv2 = new Vect(this.metadata.x2, this.metadata.y2).rotate(rotation).add(this.room.mv).add(this.room.mdragOffset);

        // calculate the min and max X and Y coords
        this.mx1 = mv1.x < mv2.x ? mv1.x : mv2.x;
        this.mx2 = mv1.x > mv2.x ? mv1.x : mv2.x;
        this.my1 = mv1.y < mv2.y ? mv1.y : mv2.y;
        this.my2 = mv1.y > mv2.y ? mv1.y : mv2.y;
        // calcuate the floor and ceiling Z coordinates relative to the room's floor
        this.z1 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.floor;
        this.z2 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.ceil;
    }
    
	setDebug(debug) {
		if (debug) {
	        this.debugBorder = document.createElement("div");
	        this.debugBorder.className = "debugBounds";
			this.debugBorder.style.position = "absolute";
			if (this.room.display) {
				this.room.display.parentElement.appendChild(this.debugBorder);
			}
		} else {
			this.debugBorder.remove();
			this.debugBorder = null;
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder) {
            viewContainer.appendChild(this.debugBorder);
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = (this.mx1 * viewScale) + viewPX;
			this.debugBorder.style.top = (this.my1 * viewScale) + viewPY;
			this.debugBorder.style.width = (this.mx2 - this.mx1) * viewScale;
			this.debugBorder.style.height = (this.my2 - this.my1) * viewScale;
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
        this.debugBorder = null;

        this.otherDoor = null;
        this.incoming = false;
    }

    updatePosition() {
        this.rotation = this.room.rotation;
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate(this.rotation).add(this.room.mv).add(this.room.mdragOffset);;
        this.outv = new Vect(this.metadata.outx, this.metadata.outy).rotate(this.rotation);
        this.floor = this.room.floor + this.metadata.floor;
        
        var width = doorSnapPixels / viewScale;

        this.mx1 = this.mv.x - width;
        this.mx2 = this.mv.x + width;
        this.my1 = this.mv.y - width;
        this.my2 = this.mv.y + width;
    }

	setDebug(debug) {
		if (debug) {
	        this.debugBorder = document.createElement("div");
	        this.debugBorder.className = "debugDoorBounds";
			this.debugBorder.style.position = "absolute";
			if (this.room.display) {
				this.room.display.parentElement.appendChild(this.debugBorder);
			}
		} else {
			this.debugBorder.remove();
			this.debugBorder = null;
		}
	}

    addDisplay(viewContainer) {
        if (this.debugBorder) {
            viewContainer.appendChild(this.debugBorder);
        }
    }

    updateView() {
        if (this.debugBorder) {
			this.debugBorder.style.left = (this.mx1 * viewScale) + viewPX;
			this.debugBorder.style.top = (this.my1 * viewScale) + viewPY;
			this.debugBorder.style.width = (this.mx2 - this.mx1) * viewScale;
			this.debugBorder.style.height = (this.my2 - this.my1) * viewScale;
        }
    }

    removeDisplay() {
        if (this.debugBorder) {
            this.debugBorder.remove();
        }
    }
}

var roomIdCount = 0;

class Room {
    constructor(metadata, mx = 0, my = 0, f = 0, r = 0) {
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

		this.viewContainer = null;
        this.display = null;
        this.outline = null;
        this.grid = null;

        this.mdragOffset = new Vect(0, 0);

        this.setPosition(mx, my, f, r);
        this.calculateAnchor();
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
        this.mv = new Vect(nmx, nmy);
        this.floor = nf;
        this.rotation = nr;

		this.updateLeafPositions();
    }

	updatePosition() {
		// for a pure view update, just worry about doors because their snap bounds depend on the zoon
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].updatePosition();
        }
	}

    updateLeafPositions() {
        // update door positions
        for (var d = 0; d < this.doors.length; d++) {
            this.doors[d].updatePosition();
        }
		// update bounds positions
        for (var b = 0; b < this.bounds.length; b++) {
            this.bounds[b].updatePosition();
        }
    }

    calculateAnchor() {
        // The min X and Y coords are what the image will be anchored to
        this.anchorMX = minBoundsMX;
        this.anchorMY = minBoundsMY;

        // update bounds and calculate overall min X and Y
        var minBoundsMX = this.mv.x;
        var minBoundsMY = this.mv.y;
        for (var i = 0; i < this.bounds.length; i++) {
            if (this.bounds[i].mx1 < minBoundsMX) {
                minBoundsMX = this.bounds[i].mx1;
            }
            if (this.bounds[i].my1 < minBoundsMY) {
                minBoundsMY = this.bounds[i].my1;
            }
        }
        // The min X and Y coords are what the image will be anchored to
        this.anchorMX = minBoundsMX - this.mv.x;
        this.anchorMY = minBoundsMY - this.mv.y;
    }

    select() {
        if (!this.outline) {
	        this.outline = this.addDisplayElement("-line-blue.png", 2);
	        this.updateView();
        }
    }

    deselect() {
        this.outline = this.removeDisplayElement(this.outline);
    }

    isSelected() {
        return this.outline != null
    }

    rotate() {
        this.setPosition(this.mv.x, this.mv.y, this.floor, (this.rotation + 90) % 360);
    }

    setDragOffset(offsetPX, offsetPY, snap) {
        if (!this.grid) {
	        this.grid = this.addDisplayElement("-bounds-blue.png", 1);
        }
        // start by snapping to the nearest meter
        this.mdragOffset.set(Math.round(offsetPX / viewScale), Math.round(offsetPY / viewScale));
        if (snap > 1) {
            var mx = this.mv.x + this.mdragOffset.x;
            var mx2 = Math.round(mx / snap) * snap;

            var my = this.mv.y + this.mdragOffset.y;
            var my2 = Math.round(my / snap) * snap;

            this.mdragOffset.addTo(mx2 - mx, my2 - my);
        }

        this.updateLeafPositions();
    }

    dropDragOffset() {
        if (this.mdragOffset.x != 0 || this.mdragOffset.y!= 0) {
            var nmv = this.mv.add(this.mdragOffset);
            this.mdragOffset.set(0, 0);
            this.setPosition(nmv.x, nmv.y, this.floor, this.rotation);
        }
        if (this.grid) {
	        this.grid = this.removeDisplayElement(this.grid);
        }
    }

    addDisplay(viewContainer) {
        this.viewContainer = viewContainer;
        this.display = this.addDisplayElement("-display.png", 2);
		for (var b = 0; b < this.doors.length; b++) {
			this.doors[b].addDisplay(viewContainer);
		}
		for (var b = 0; b < this.bounds.length; b++) {
			this.bounds[b].addDisplay(viewContainer);
		}
        this.updateView();
    }

    addDisplayElement(imageSuffix, zIndex = 0) {
        // Ugh, have to build the <img> element the hard way
        var element = document.createElement("img");
        element.style = "position: absolute;";
        // Need to explicitly set the transform origin for off-center rooms
        element.style.transformOrigin = (-this.anchorMX * imgScale) + "px " + (-this.anchorMY * imgScale) + "px";
        element.style.zIndex = zIndex;
        element.id = this.id;
		// have to explicitly tell Chrome that none of these listeners are passive or it will cry
        element.addEventListener("mousedown", mouseDown, { passive: false });
        element.addEventListener("touchstart", touchStart, { passive: false });
        element.addEventListener("wheel", wheel, { passive: false });
        element.src = "img" + imgScale + "x/" + this.metadata.image + imageSuffix;
        element.room = this;
        this.viewContainer.appendChild(element);
        return element;
    }

    removeDisplay() {
        // remove the three images, whichever ones are presesnt
	    this.display = this.removeDisplayElement(this.display);
	    this.outline = this.removeDisplayElement(this.outline);
	    this.grid = this.removeDisplayElement(this.grid);
	    // remove bounds debug boxes, if present
		for (var b = 0; b < this.doors.length; b++) {
			this.doors[b].removeDisplay();
		}
		for (var b = 0; b < this.bounds.length; b++) {
			this.bounds[b].removeDisplay();
		}
    }

    removeDisplayElement(element) {
	    if (element) {
            element.remove();
        }
        return null;
    }

    updateView() {
        if (this.display) {
            // transform the anchor coords to pixel coords
			var roomViewCenterPX = ((this.mv.x + this.mdragOffset.x) * viewScale) + viewPX;
			var roomViewCenterPY = ((this.mv.y + this.mdragOffset.y) * viewScale) + viewPY;
			// we have to add the anchor points scaled by the image scale rather than the view scale in order for the
			// css transform to put the room in the right place.  so much trial and error to get this rght...
            var roomViewPX = roomViewCenterPX + (this.anchorMX * imgScale);
            var roomViewPY = roomViewCenterPY + (this.anchorMY * imgScale);

			// final scaling of the image
			var scale = viewScale / imgScale;
			// update the three images, whichever ones are present
			this.updateViewElement(this.display, roomViewPX, roomViewPY, this.rotation, scale);
			this.updateViewElement(this.outline, roomViewPX, roomViewPY, this.rotation, scale);
			this.updateViewElement(this.grid, roomViewPX, roomViewPY, this.rotation, scale);
			// update debug bounds views, if present
			for (var d = 0; d < this.doors.length; d++) {
				this.doors[d].updateView();
			}
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].updateView();
			}
        }
    }

    updateViewElement(e, px, py, rotation, scale) {
        if (e) {
		    // https://www.w3schools.com/cssref/css3_pr_transform.asp
		    // translate() need to be before rotate() and scale()
		    e.style.transform = "translate(" + px + "px, " + py + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")"
        }
    }
}
