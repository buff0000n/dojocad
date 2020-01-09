var hrefUpdateDelay = 1000;
var hrefUpdateTimeout = null;
var hrefToUpdate = null;

// modify a URL parameter directly in the browser location bar
function modifyUrlQueryParam(key, value) {
    var href = hrefToUpdate ? hrefToUpdate : window.location.href;

	if (href.match(new RegExp("[?&]" + key + "="))) {
	    href = href.replace(new RegExp("([?&]" + key + "=)[^&#]*"), "$1" + value);

	} else if (href.indexOf("?") > 0) {
		href += "&" + key + "=" + value;
	} else {
		href += "?" + key + "=" + value;
	}

	if (hrefUpdateTimeout) {
		clearTimeout(hrefUpdateTimeout);
	}

	hrefToUpdate = href;
	hrefUpdateTimeout = setTimeout(actuallyModifyUrl, hrefUpdateDelay);
}

function actuallyModifyUrl() {
	// shenanigans
    history.replaceState( {} , document.title, hrefToUpdate );
	hrefUpdateTimeout = null;
	hrefToUpdate = null;
}

function getQueryParam(url, name) {
    // from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // weird that there's no built in function for this
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function buildQueryUrl(query) {
    // get the current URL and strip out any query string
    var url = window.location.href;
    url = url.replace(/\?.*/, "");
    // append our parameters
    url += query;

    return url;
}

function convertToPngLink(canvas, name) {
    // builds a huuuuge URL with the base-64 encoded PNG data embedded inside it
    var src = canvas.toDataURL();
    // generate a file name
    var fileName = name + ".png";

    var a = document.createElement("a");
    a.download = fileName;
    a.href = src;
    a.innerHTML = fileName;
    return a;
}

// returns true if the list was changed
function removeFromList(list, item) {
	var index = list.indexOf(item);
	if (index >= 0) {
		list.splice(index, 1);
		return true;

	} else {
		return false;
	}
}

// returns true if the list was changed
function addToListIfNotPresent(list, item) {
	var index = list.indexOf(item);
	if (index == -1) {
		list.push(item);
		return true;

	} else {
		return false;
	}
}

function addAllToListIfNotPresent(list, list2) {
	var ret = false;
	for (var l = 0; l < list2.length; l++) {
		ret |= addToListIfNotPresent(list, list2[l]);
	}
	return ret;
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

// from https://stackoverflow.com/questions/890807/iterate-over-a-javascript-associative-array-in-sorted-order
function keys(map) {
    var keys = Array();

    for(var key in map) {
        if(map.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
}

function sortKeys(map) {
	var sortedKeys = keys(map).sort();
	var map2 = Array();
	for (var i in sortedKeys) {
		map2[sortedKeys[i]] = map[sortedKeys[i]];
	}
	return map2;
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
            case 0  :              return this;
            case 90 : case -270: return new Vect(-this.y, this.x);
            case 180: case -180: return new Vect(-this.x, -this.y);
            case 270: case  -90:  return new Vect(this.y, -this.x);
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
        return this;
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared() {
        return (this.x * this.x) + (this.y * this.y);
    }

    addTo(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    toRotation() {
        if (Math.abs(this.x) >= Math.abs(this.y)) {
            if (this.x < 0) return 180;
            else return 0;

        } else {
            if (this.y < 0) return 270;
            else return 90;
        }
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
}

/**
 * boxes1 and boxes2 are Arrays containg box objects.  Box objects contain six fields:
 *    x1, y1, z1, x2, y2, z2.  Where x1 < x2, y1 < y2, z1 < z2
 * The return value is a list of pairs of boxes, one from each side, that collide.
 */
function findCollisions(boxes1, boxes2, threshold = 0) {
	var collisions = Array();
	for (b1 = 0; b1 < boxes1.length; b1++) {
		for (b2 = 0; b2 < boxes2.length; b2++) {
			var box1 = boxes1[b1];
			var box2 = boxes2[b2];
			if ((box1.x2 + threshold > box2.x1) &&
			    (box2.x2 + threshold > box1.x1) &&
			    (box1.y2 + threshold > box2.y1) &&
			    (box2.y2 + threshold > box1.y1) &&
			    (box1.z2 + threshold > box2.z1) &&
			    (box2.z2 + threshold > box1.z1)) {
			    collisions.push([box1, box2]);
		    }
		}
	}
	return collisions;
}