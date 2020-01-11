//==============================================================
// Floor stuff
//==============================================================

function getFloorName(floor) {
	return floor == 0 ? "G" : floor < 0 ? ("B" + (-floor)) : floor
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
}

var selectedFloorEntry = null;
var floorEntries = Array();

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

function getFloorEntry(floor, add = false) {
	if (!floorEntries[floor]) {
		for (var f = 0; floor > 0 ? f <= floor : f >= floor; f += (floor > 0 ? 1 : -1)) {
			if (!floorEntries[f]) {
				floorEntries[f] = new FloorEntry(f);
				if (floor > 0) {
					insertAfter(floorEntries[f].div, document.getElementById("floorUpButton"));
				} else {
					insertBefore(floorEntries[f].div, document.getElementById("floorDownButton"));
				}
			}
		}
	}
	return floorEntries[floor];
}

function checkInactiveFloors() {
	checkInactiveFloors0(1);
	checkInactiveFloors0(-1);

	if (selectedFloorEntry) {
		if (floorEntries[selectedFloorEntry.floor + 1]) {
			document.getElementById("floorUpButton").className = "button";
		} else {
			document.getElementById("floorUpButton").className = "button-disabled";
		}

		if (floorEntries[selectedFloorEntry.floor - 1]) {
			document.getElementById("floorDownButton").className = "button";
		} else {
			document.getElementById("floorDownButton").className = "button-disabled";
		}
	}
}

function checkInactiveFloors0(dir) {
	var f = 0;
	while (floorEntries[f]) { f += dir; }
	f -= dir;
	while (f != 0 && !floorEntries[f].isActive()) {
		var entry = floorEntries[f];
		floorEntries[f] = null;
		entry.div.remove();
		f -= dir;
	}
}

function setSelectedFloor(floor) {
	if (selectedFloorEntry) {
		selectedFloorEntry.setSelected(false);
	}
	selectedFloorEntry = getFloorEntry(floor, true);
	selectedFloorEntry.setSelected(true);
	checkInactiveFloors();
}

function addFloorError(floor, error) {
	getFloorEntry(floor, true).addError(error);
	addAllError(error);
}

function removeFloorError(floor, error) {
	getFloorEntry(floor).removeError(error);
	removeAllError(error);
}

function addFloorRoom(room) {
	if (room.multifloor) {
		var floors = room.getFloors();
		for (var f = 0; f < floors.length; f++) {
			getFloorEntry(floors[f], true).addRoom(room);
		}
	} else {
		getFloorEntry(room.floor, true).addRoom(room);
	}
	checkInactiveFloors();
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
}
