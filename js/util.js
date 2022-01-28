//////////////////////////////////////////////////////////////////////////
// URL utils
//////////////////////////////////////////////////////////////////////////

var hrefUpdateDelay = 1000;
var hrefUpdateTimeout = null;
var hrefToUpdate = null;

// modify a URL parameter directly in the browser location bar
function modifyUrlQueryParam(key, value) {
    var href = getHref();

	if (href.match(new RegExp("[?&]" + key + "="))) {
	    href = href.replace(new RegExp("([?&]" + key + "=)[^&#]*"), "$1" + value);

	} else if (href.indexOf("?") > 0) {
		href += "&" + key + "=" + value;
	} else {
		href += "?" + key + "=" + value;
	}

	updateHref(href);
}

function removeUrlQueryParam(key) {
    var href = getHref();

	// corner cases the stupid way
    href = href.replace(new RegExp("([?&])" + key + "=[^&#]*&"), "$1");
    href = href.replace(new RegExp("[&?]" + key + "=[^&#]*"), "");

	updateHref(href);
}

function getHref() {
    return hrefToUpdate ? hrefToUpdate : window.location.href;
}

function updateHref(href) {
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

function removeUrlAnchor() {
    var href = getHref();
    if (href.indexOf("#") > 0) {
        href = href.substring(0, href.indexOf("#"));
        updateHref(href);
    }
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

//////////////////////////////////////////////////////////////////////////
// PNG conversion
//////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////
// general collection utils
//////////////////////////////////////////////////////////////////////////

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
function removeMatchesFromList(list, fun) {
	var changed = false;
	for (var i = list.length - 1; i >= 0; i--) {
		if (fun(list[i])) {
			list.splice(i, 1);
			changed = true;
		}
	}
	return changed;
}

// returns true if the list was changed
function removeFirstMatchFromList(list, fun) {
	for (var i = list.length - 1; i >= 0; i--) {
		if (fun(list[i])) {
			list.splice(i, 1);
			return true;
		}
	}
	return false;
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

function arrayEquals(a, b) {
    return a == null ? b == null :
        b == null ? false :
        a.length == b.length && a.every((val, index) => val == b[index]);
}

// find child elements with classNames maching the keys of nameMapping and changing
// those classNames to the values
function replaceClassNames(root, nameMapping) {
    // why the hell is is (value, key)?
    nameMapping.forEach((to, from) => {
        if (root.classList.contains(from)) {
            // remove old className and add new one
            root.classList.remove(from);
            root.classList.add(to);
        }
    });
    var children = root.children;
    for (var i = 0; i < root.children.length; i++) {
        // recursive
        replaceClassNames(root.children.item(i), nameMapping);
    }
}

//////////////////////////////////////////////////////////////////////////
// parsing
//////////////////////////////////////////////////////////////////////////

function quotedSplit(string, splitChar, keepQuotes=false) {
    var split = [];
    var token = "";
    var quoted = false;
    for (var i = 0; i < string.length; i++) {
        var c = string[i];
        if (c == splitChar && !quoted) {
            split.push(token);
            token = "";
            continue;

        } else if (c == '"') {
            quoted = !quoted;
            if (keepQuotes) {
                token = token + c;
            }
            continue;

        } else if (c == '\\') {
            if (i < string.length - 1 && string[i+1] == '"') {
                if (keepQuotes) {
                    token = token + c;
                }
                i++;
            }
        }
        token = token + string[i];
    }
    split.push(token);
    return split;
}

//////////////////////////////////////////////////////////////////////////
// formatting
//////////////////////////////////////////////////////////////////////////

function formatNumber(num) {
    if (Math.abs(num) < 1000) {
        return num;
    }
    // get the number of digits
    var digits = Math.ceil(Math.log10(Math.abs(num)));
    // highest multiple of 3 that's strictly less than digits
    // max out with trillions
    var refDigits = Math.min(digits - ((digits - 1) % 3) - 1, 12);

    var num2 = 0;
    if ((digits - refDigits) == 1) {
        // special case for 1 shown digit: show tenths as well
        num2 = Math.round(num / Math.pow(10, digits - 2)) / 10;

    } else {
        // show digits past the reference
        num2 = Math.round(num / Math.pow(10, refDigits));
    }

    var suffix = "X";
    switch (refDigits) {
        case 3: suffix = "K"; break;
        case 6: suffix = "M"; break;
        case 9: suffix = "B"; break;
        case 12: suffix = "T"; break;
    }

    return num2 + suffix;
}

//////////////////////////////////////////////////////////////////////////
// vector class
//////////////////////////////////////////////////////////////////////////

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

    scaleSeparate(xs, ys) {
        this.x *= xs;
        this.y *= ys;
        return this;
    }

    round(rx, ry = rx) {
        return new Vect(
            rx * (Math.round(this.x / rx)),
            ry * (Math.round(this.y / ry))
         );
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared() {
        return (this.x * this.x) + (this.y * this.y);
    }

    distance(other) {
        return Math.sqrt(distanceSquared(other));
    }

    distanceSquared(other) {
        var dx = this.x - other.x;
        var dy = this.y - other.y;
        return (dx * dx) + (dy * dy);
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

    copy() {
        return new Vect(this.x, this.y);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }

    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed()})`;
    }
}

//////////////////////////////////////////////////////////////////////////
// collision search
//////////////////////////////////////////////////////////////////////////

/**
 * boxes1 and boxes2 are Arrays containg box objects.  Box objects contain six fields:
 *    x1, y1, z1, x2, y2, z2.  Where x1 < x2, y1 < y2, z1 < z2
 * The return value is a list of pairs of boxes, one from each side, that collide.
 */
function findCollisions(boxes1, boxes2, threshold = 0, ignore=true) {
	var collisions = Array();
	for (b1 = 0; b1 < boxes1.length; b1++) {
		for (b2 = 0; b2 < boxes2.length; b2++) {
			var box1 = boxes1[b1];
			var box2 = boxes2[b2];
            // check for ignored flag
			if (ignore && (box1.ignore || box2.ignore)) {
			    continue;
			}
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

//////////////////////////////////////////////////////////////////////////
// URL utils
//////////////////////////////////////////////////////////////////////////

function generateColorPickerPNGLink(width, height, name, margin=0) {
    return margin > 0 ?
        generatePickerPNGLink(width, height, name, margin, (i) => {
            return "hue-rotate(" + (i-120) + "deg)";
        }) :
        generatePickerPNGLink(width, height, name, margin, (i) => {
            return "hue-rotate(" + (i-120) + "deg) brightness(200%)";
        });
}

function generateSatPickerPNGLink(width, height, name, margin=0) {
    return margin > 0 ?
        generatePickerPNGLink(width, height, name, margin, (i) => {
            var satVal = i * 100 / 360;
            return "brightness(200%) saturate(" + satVal + "%)";
        }) :
        generatePickerPNGLink(width, height, name, margin, (i) => {
            var satVal = i * 180 / 360;
            return "saturate(" + (satVal) + "%) hue-rotate(-120deg) brightness(100%)";
        });
}

function generateLumPickerPNGLink(width, height, name, margin=0) {
    return margin > 0 ?
        generatePickerPNGLink(width, height, name, margin, (i) => {
            var lumVal = i * 100 / 360;
            return "brightness(" + (lumVal*2) + "%)";

        }) :
        generatePickerPNGLink(width, height, name, margin, (i) => {
            var lumVal = i * 100 / 360;
            return "saturate(0%) brightness(" + (lumVal*2) + "%)";
        });

}

function generatePickerPNGLink(width, height, name, margin, filterFunc) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
    var context = canvas.getContext("2d");

    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#008000";
    context.lineWidth = Math.ceil(width / 360);

    for (var i = 0; i < 360; i++) {
        context.filter = filterFunc(i);
        context.beginPath();
        var x = margin + ((i + 0.5)*((width - (margin*2))/360));
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    return convertToPngLink(canvas, name);
}