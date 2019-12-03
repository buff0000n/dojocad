function getRoomMetadata(id) {
    var rmd = roomMetadata.rooms.find(room => room.id == id);
    if (!rmd) {
        throw "Unknown room id: " + id
    }
    return rmd;
}

function setImgRotation(e, rotation) {
    // https://www.w3schools.com/cssref/css3_pr_transform.asp
    e.style.transform = "rotate(" + rotation + "deg)"

    // todo: need these?
    //-webkit-transform:rotate(180deg);
    //-moz-transform: rotate(180deg);
    //-ms-transform: rotate(180deg);
    //-o-transform: rotate(180deg);
    //transform: rotate(180deg);
}

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
}
