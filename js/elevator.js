//==============================================================
// Floor stuff
//==============================================================

// My phone's big enough to list 7 floors plus the '...' and arrow blocks.
var maxVisibleFloors = 7;

function getFloorName(floor) {
	return floor < 0 ? ("B" + (-floor)) : (floor + 1)
}

class FloorEntry {
	constructor(floor) {
		this.floor = floor;
	    this.div = document.createElement("div");
		this.div.innerHTML = getFloorName(floor);
		this.div.floor = this.floor;
		this.div.addEventListener("click", function() { doSetFloor(this.floor) } );
		this.rooms = Array();
		this.errors = Array();
		this.selected = false;
		this.refresh();
	}

	setSelected(selected) {
		this.selected = selected;
		this.refresh();
	}

	addError(error) {
		if (addToListIfNotPresent(this.errors, error)) {
			this.refresh();
		}
	}

	hasErrors() {
		return this.errors.length > 0;
	}

	removeError(error) {
		if (removeFromList(this.errors, error)) {
			this.refresh();
		}
	}

	addRoom(room) {
		if (addToListIfNotPresent(this.rooms, room)) {
			this.refresh();
		}
	}

	removeRoom(room) {
		if (removeFromList(this.rooms, room)) {
			removeFromList(this.errors, room);
			removeMatchesFromList(this.errors, function(e) { return e.room == room });
			this.refresh();
		}
	}

	refresh() {
		if (this.selected) {
			if (this.errors.length > 0) {
			    this.div.className = "floor-button-error-selected";
			} else if (this.rooms.length == 0) {
			    this.div.className = "floor-button-empty-selected";
			} else {
			    this.div.className = "floor-button-selected";
			}

		} else {
			if (this.errors.length > 0) {
			    this.div.className = "floor-button-error";
			} else if (this.rooms.length == 0) {
			    this.div.className = "floor-button-empty";
			} else {
			    this.div.className = "floor-button";
			}
		}
	}

	isActive() {
		return this.selected || this.rooms.length > 0;
	}

	setHidden(hidden) {
		this.div.style.display = hidden ? "none" : "block";
	}
}

var floorEntries = Array();

var selectedFloorEntry = null;
var topFloorEntry = null;
var bottomFloorEntry = null;
var topWindowFloorEntry = null;
var bottomWindowFloorEntry = null;

function doFloorUp() {
	if (floorEntries[viewFloor + 1]) {
		setViewP(viewPX, viewPY, viewScale, viewFloor + 1);
	}
}

function doFloorDown() {
	if (floorEntries[viewFloor - 1]) {
		setViewP(viewPX, viewPY, viewScale, viewFloor - 1);
	}
}

function doSetFloor(floor) {
	if (floorEntries[floor]) {
		setViewP(viewPX, viewPY, viewScale, floor);
	}
}

function getFloorEntry(floor) {
	if (!floorEntries[floor]) {
		for (var f = 0; floor > 0 ? f <= floor : f >= floor; f += (floor > 0 ? 1 : -1)) {
			if (!floorEntries[f]) {
				var entry = new FloorEntry(f);
				floorEntries[f] = entry;
				// insert at the appropriate place inside the floor display div
				if (floor > 0) {
					insertAfter(entry.div, document.getElementById("floorUpButton"));
				} else {
					insertBefore(entry.div, document.getElementById("floorDownButton"));
				}
				// maintain top and bottom floor pointers
				if (!topFloorEntry || topFloorEntry.floor < floor) {
					topFloorEntry = entry;
				}
				if (!bottomFloorEntry || bottomFloorEntry.floor > floor) {
					bottomFloorEntry = entry;
				}
				// if the new floor is adjacent to the window then expand the window
				if (!topWindowFloorEntry) {
					topWindowFloorEntry = entry;
				}
				if (!bottomWindowFloorEntry) {
					bottomWindowFloorEntry = entry;
				}
				if (!topWindowFloorEntry || topWindowFloorEntry.floor == floor - 1) {
					moveWindowUp();
				}
				if (!bottomWindowFloorEntry || bottomWindowFloorEntry.floor == floor + 1) {
					moveWindowDown();
				}
				// if the new floor is still outside the window then hide it
				if (entry.floor > topWindowFloorEntry.floor || entry.floor < bottomWindowFloorEntry.floor) {
					entry.setHidden(true);
				}
			}
		}
	}
	return floorEntries[floor];
}

function checkInactiveFloors() {
	checkInactiveFloors0(1);
	checkInactiveFloors0(-1);
}

function checkInactiveFloors0(dir) {
	var f = 0;
	while (floorEntries[f]) { f += dir; }
	f -= dir;
	while (f != 0 && !floorEntries[f].isActive()) {
		var entry = floorEntries[f];
		if (dir == 1 && entry == topFloorEntry) {
			// maintain the top floor and top window floor pointers
			topFloorEntry = floorEntries[f - 1];
			if (entry == topWindowFloorEntry) {
				topWindowFloorEntry = topFloorEntry;
				moveWindowDown();
			}

		} else if (dir == -1 && entry == bottomFloorEntry) {
			// maintain the bottom floor and bottom window floor pointers
			bottomFloorEntry = floorEntries[f + 1];
			if (entry == bottomWindowFloorEntry) {
				bottomWindowFloorEntry = bottomFloorEntry;
				moveWindowUp();
			}
		}
		floorEntries[f] = null;
		entry.div.remove();
		f -= dir;
	}
}

function initFloorWindow(floor) {
	var top = floor;
	var bot = floor;
	var incTop = true;
	while ((top < topFloorEntry.floor || bot > bottomFloorEntry.floor) && top - bot < (maxVisibleFloors - 1)) {
		if (incTop && top < topFloorEntry.floor) {
			top++;
		}
		else if (!incTop && bot > bottomFloorEntry.floor) {
			bot--;
		}
		incTop = !incTop;
	}

	for (var f = bot; f <= top; f++) {
		floorEntries[f].setHidden(false);
	}
	for (var f = top + 1; floorEntries[f]; f++) {
		floorEntries[f].setHidden(true);
	}
	for (var f = bot - 1; floorEntries[f]; f--) {
		floorEntries[f].setHidden(true);
	}

	topWindowFloorEntry = floorEntries[top];
	bottomWindowFloorEntry = floorEntries[bot];
}

function moveWindowUp() {
	if (topWindowFloorEntry != topFloorEntry) {
		topWindowFloorEntry = floorEntries[topWindowFloorEntry.floor + 1];
		topWindowFloorEntry.setHidden(false);
		while (topWindowFloorEntry.floor - bottomWindowFloorEntry.floor > (maxVisibleFloors - 1)) {
			bottomWindowFloorEntry.setHidden(true);
			bottomWindowFloorEntry = floorEntries[bottomWindowFloorEntry.floor + 1];
		}
	}
}

function moveWindowDown() {
	if (bottomWindowFloorEntry != bottomFloorEntry) {
		bottomWindowFloorEntry = floorEntries[bottomWindowFloorEntry.floor - 1];
		bottomWindowFloorEntry.setHidden(false);
		while (topWindowFloorEntry.floor - bottomWindowFloorEntry.floor > (maxVisibleFloors - 1)) {
			topWindowFloorEntry.setHidden(true);
			topWindowFloorEntry = floorEntries[topWindowFloorEntry.floor - 1];
		}
	}
}

function adjustFloorWindow() {
	if (selectedFloorEntry) {
		while (selectedFloorEntry.floor > topWindowFloorEntry.floor) {
			moveWindowUp();
		}

		while (selectedFloorEntry.floor < bottomWindowFloorEntry.floor) {
			moveWindowDown();
		}
	}

	// preventing the sidebar from popping is worth the extra headache
	if (topWindowFloorEntry == topFloorEntry) {
		document.getElementById("floorUpButtonImg").src = "icons/icon-up.png";
		document.getElementById("floorUpButtonImg").srcset = "icons2x/icon-up.png 2x";
		document.getElementById("floorUpButton").className = selectedFloorEntry == topFloorEntry ? "button-disabled" : "button";

	} else {
		document.getElementById("floorUpButtonImg").src = "icons/icon-up-more.png";
		document.getElementById("floorUpButtonImg").srcset = "icons2x/icon-up-more.png 2x";
		var hasError = false;
		for (var f = topWindowFloorEntry.floor + 1; f <= topFloorEntry.floor; f++) {
			if (getFloorEntry(f).hasErrors()) {
				hasError = true;
				break;
			}
		}
		document.getElementById("floorUpButton").className = hasError ? "button-error" : "button";
	}

	if (bottomWindowFloorEntry == bottomFloorEntry) {
		document.getElementById("floorDownButtonImg").src = "icons/icon-down.png";
		document.getElementById("floorDownButtonImg").srcset = "icons2x/icon-down.png 2x";
		document.getElementById("floorDownButton").className = selectedFloorEntry == bottomFloorEntry ? "button-disabled" : "button";

	} else {
		document.getElementById("floorDownButtonImg").src = "icons/icon-down-more.png";
		document.getElementById("floorDownButtonImg").srcset = "icons2x/icon-down-more.png 2x";
		var hasError = false;
		for (var f = bottomWindowFloorEntry.floor - 1; f >= bottomFloorEntry.floor; f--) {
			if (getFloorEntry(f).hasErrors()) {
				hasError = true;
				break;
			}
		}
		document.getElementById("floorDownButton").className = hasError ? "button-error" : "button";
	}
}

function setSelectedFloor(floor) {
	var initWindow = false;
	if (selectedFloorEntry) {
		selectedFloorEntry.setSelected(false);
	} else {
		initWindow = true;
	}
	selectedFloorEntry = getFloorEntry(floor);
	selectedFloorEntry.setSelected(true);
	checkInactiveFloors();
	if (initWindow) {
		initFloorWindow(floor);
	}
	adjustFloorWindow();
}

function addFloorError(floor, error) {
	getFloorEntry(floor).addError(error);
	addAllError(error);
	// just to keep error highlighting up to date
	adjustFloorWindow();
}

function removeFloorError(floor, error) {
	getFloorEntry(floor).removeError(error);
	removeAllError(error);
	// just to keep error highlighting up to date
	adjustFloorWindow();
}

function addFloorRoom(room) {
	if (room.multifloor) {
		var floors = room.getFloors();
		for (var f = 0; f < floors.length; f++) {
			getFloorEntry(floors[f]).addRoom(room);
		}
	} else {
		getFloorEntry(room.floor).addRoom(room);
	}
	checkInactiveFloors();
	adjustFloorWindow();
}

function removeFloorRoom(room) {
	if (room.multifloor) {
		var floors = room.getFloors();
		for (var f = 0; f < floors.length; f++) {
			getFloorEntry(floors[f]).removeRoom(room);
		}
	} else {
		getFloorEntry(room.floor).removeRoom(room);
	}
	checkInactiveFloors();
	adjustFloorWindow();
}
