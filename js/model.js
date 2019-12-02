class Bound {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;
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
}

class Door {
    constructor(room, doorMetadata) {
        this.room = room;
        this.metadata = doorMetadata;

        this.otherDoor = null;
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

        this.element = null;

        this.viewOffsetPX = 0;
        this.viewOffsetPY = 0;

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

    rotate() {
        this.setPosition(this.mv.x, this.mv.y, this.floor, (this.rotation + 90) % 360);
    }

    setViewOffset(offsetPX, offsetPY) {
        this.viewOffsetPX = offsetPX;
        this.viewOffsetPY = offsetPY;
    }

    dropViewOffset() {
        if (this.viewOffsetPX != 0 || this.viewOffsetPY != 0) {
            var nmx = this.mv.x + Math.round((this.viewOffsetPX * 1.0) / viewScale);
            var nmy = this.mv.y + Math.round((this.viewOffsetPY * 1.0) / viewScale);
            this.viewOffsetPX = 0;
            this.viewOffsetPY = 0;
            this.setPosition(nmx, nmy, this.floor, this.rotation);
        }
    }

    addDisplay(parent) {
        //parent.innerHTML += `<img style="position: absolute;" id="` + this.id + `" src="img/` + this.metadata.image + `.png" onmousedown="mouseDown();"/>`;
        //this.element = document.getElementById(this.id);

        // Ugh, have to build the <img> element the hard way
        this.element = document.createElement("img");
        this.element.style = "position: absolute;";
        this.element.style.transformOrigin = (-this.anchorMX * viewScale) + "px " + (-this.anchorMY * viewScale) + "px";
        this.element.id = this.id;
        this.element.onmousedown = mouseDown;
        this.element.src = "img" + viewScale + "x/" + this.metadata.image + ".png";
        this.element.room = this;
        parent.appendChild(this.element);

        this.updateView();
    }

    removeDisplay() {
        this.element.remove();
        this.element = null;
    }

    updateView() {
        if (this.element) {
            // transform the anchor coords to pixel coords
            var roomViewPX = ((this.mv.x + this.anchorMX) * viewScale) + viewPX + this.viewOffsetPX;
            var roomViewPY = ((this.mv.y + this.anchorMY) * viewScale) + viewPY + this.viewOffsetPY;

            // update the image position and rotation
            this.element.style.left = roomViewPX + "px";
            this.element.style.top = roomViewPY + "px";
            setImgRotation(this.element, this.rotation);
        }
    }

}
