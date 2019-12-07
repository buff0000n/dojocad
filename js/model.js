class Bound {
    constructor(room, doorMetadata, debug = false) {
        this.room = room;
        this.metadata = doorMetadata;
        this.debugBorder = null;

		if (debug) {
	        this.debugBorder = document.createElement("div");
	        this.debugBorder.className = "debugBounds";
			this.debugBorder.style.position = "absolute";
		}
    }

    updatePosition() {
        // rotate the bound corners and translate by the room position
        var rotation = this.room.rotation;
        var mv1 = new Vect(this.metadata.x1, this.metadata.y1).rotate(rotation).add(this.room.mv);
        var mv2 = new Vect(this.metadata.x2, this.metadata.y2).rotate(rotation).add(this.room.mv);

        // calculate the min and max X and Y coords
        this.mx1 = mv1.x < mv2.x ? mv1.x : mv2.x;
        this.mx2 = mv1.x > mv2.x ? mv1.x : mv2.x;
        this.my1 = mv1.y < mv2.y ? mv1.y : mv2.y;
        this.my2 = mv1.y > mv2.y ? mv1.y : mv2.y;
        // calcuate the floor and ceiling Z coordinates relative to the room's floor
        this.z1 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.floor;
        this.z2 = (this.room.floor * roomMetadata.general.floor_distance) + this.metadata.ceil;
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

        this.otherDoor = null;
        this.incoming = false;
    }

    updatePosition() {
        this.rotation = this.room.rotation;
        this.mv = new Vect(this.metadata.x, this.metadata.y).rotate(this.rotation).add(this.room.mv);
        this.outv = new Vect(this.metadata.outx, this.metadata.outy).rotate(this.rotation);

        this.floor = this.room.floor + this.metadata.floor;
    }

    updateView() {
        // todo
    }
}

var roomIdCount = 0;

class Room {
    constructor(metadata, mx = 0, my = 0, f = 0, r = 0, debug = false) {
        this.metadata = metadata;
        this.id = "room" + (roomIdCount++);

        this.bounds = Array();
        for (var i = 0; i < this.metadata.bounds.length; i++) {
            this.bounds.push(new Bound(this, this.metadata.bounds[i], debug));
        }
        this.doors = Array();
        for (var i = 0; i < this.metadata.doors.length; i++) {
            this.doors.push(new Door(this, this.metadata.doors[i]));
        }

		this.viewContainer = null;
        this.display = null;
        this.outline = null;
        this.grid = null;

        this.dragOffsetMX = 0;
        this.dragOffsetMY = 0;

        this.setPosition(mx, my, f, r);
        this.calculateAnchor();
    }

    setPosition(nmx, nmy, nf, nr) {
        this.mv = new Vect(nmx, nmy);
        this.floor = nf;
        this.rotation = nr;


        // update door positions
        for (var i = 0; i < this.doors.length; i++) {
            this.doors[i].updatePosition();
        }

        for (var i = 0; i < this.bounds.length; i++) {
            this.bounds[i].updatePosition();
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
        this.dragOffsetMX = Math.round(offsetPX / viewScale);
        this.dragOffsetMY = Math.round(offsetPY / viewScale);
        if (snap > 1) {
            var mx = this.mv.x + this.dragOffsetMX;
            var mx2 = Math.round(mx / snap) * snap;
            this.dragOffsetMX = this.dragOffsetMX + (mx2 - mx); 
            var my = this.mv.y + this.dragOffsetMY;
            var my2 = Math.round(my / snap) * snap;
            this.dragOffsetMY = this.dragOffsetMY + (my2 - my); 
        }
    }

    dropDragOffset() {
        if (this.dragOffsetMX != 0 || this.dragOffsetMY != 0) {
            var nmx = this.mv.x + this.dragOffsetMX;
            var nmy = this.mv.y + this.dragOffsetMY;
            this.dragOffsetMX = 0;
            this.dragOffsetMY = 0;
            this.setPosition(nmx, nmy, this.floor, this.rotation);
        }
        if (this.grid) {
	        this.grid = this.removeDisplayElement(this.grid);
        }
    }

    addDisplay(viewContainer) {
        this.viewContainer = viewContainer;
        this.display = this.addDisplayElement("-display.png", 2);
		for (var b = 0; b < this.bounds.length; b++) {
			this.bounds[b].addDisplay(viewContainer);
		}
        this.updateView();
    }

    addDisplayElement(imageSuffix, zIndex = 0) {
        // Ugh, have to build the <img> element the hard way
        var element = document.createElement("img");
        element.style = "position: absolute;";
        // Need to do some voodoo to get it to rotate around the correct point
        // I guess we actually don't need this?
        //element.style.transformOrigin = (-this.anchorMX * imgScale) + "px " + (-this.anchorMY * imgScale) + "px";
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
			var roomViewCenterPX = ((this.mv.x + this.dragOffsetMX) * viewScale) + viewPX;
			var roomViewCenterPY = ((this.mv.y + this.dragOffsetMY) * viewScale) + viewPY;
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
			for (var b = 0; b < this.bounds.length; b++) {
				this.bounds[b].updateView(roomViewCenterPX, roomViewCenterPY);
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
