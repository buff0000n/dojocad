
function setHue(e, hue) {
    // https://www.w3schools.com/cssref/css3_pr_filter.asp
    e.style.filter = "hue-rotate(" + hue + "deg)"
}

function setOpacity(e, opacity) {
    // https://www.w3schools.com/cssref/css3_pr_filter.asp
    e.style.filter = "opacity(" + opacity + ")"
}

function removeFromList(list, item) {
	var index = list.indexOf(item);
	if (index >= 0) {
		list.splice(index, 1);
		return true;

	} else {
		return false;
	}
}

class Vect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    rotate(rotation) {
        // let's keep real simple
        switch (rotation) {
            case 0: return this;
            case 90: return new Vect(-this.y, this.x);
            case 180: return new Vect(-this.x, -this.y);
            case 270: return new Vect(this.y, -this.x);
            default: throw "Unexpected rotation: " + rotation;
        }
    }

    add(v) {
        return new Vect(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vect(this.x - v.x, this.y - v.y);
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
    }

    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    addTo(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    toRotation() {
        if (Math.abs(this.x) >= math.abs(this.y)) {
            if (x < 0) return 180;
            else return 0;

        } else {
            if (y < 0) return 270;
            else return 90;
        }
    }
}
