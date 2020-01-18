class RoomRule {
	roomAdded(room) {
	}

	roomRemoved(room) {
	}

	getRoomWarning(roomMetaData) {
		return null;
	}

	getGlobalError() {
		return null;
	}

	toString() {
		return "Rule";
	}
}

function updateStat(id, value, error, rule) {
	var node = document.getElementById(id)
	node.innerHTML = value
	node.parentElement.className = error ? "field-error" : "field";
	if (error) {
		addAllError(rule.toString());
	} else {
		removeAllError(rule.toString());
	}
}

class RoomCountRule extends RoomRule {
	constructor(maxRooms) {
		super();
		this.maxRooms = maxRooms;
		this.numRooms = 0;
		this.errorMessage = "Limit " + maxRooms + " rooms";
	}

	roomAdded(room) {
		this.numRooms++;
		updateStat("numRoomsStat", this.numRooms, this.numRooms > this.maxRooms, this);
	}

	roomRemoved(room) {
		this.numRooms--;
		updateStat("numRoomsStat", this.numRooms, this.numRooms > this.maxRooms, this);
	}

	getRoomWarning(roomMetaData) {
		if (this.numRooms >= this.maxRooms) {
			return this.toString();
		} else {
			return null;
		}
	}

	getGlobalError() {
		return this.numRooms > this.maxRooms ? errorMessage : null;
	}

	toString() {
		return this.errorMessage;
	}
}

class EnergyRule extends RoomRule {
	constructor() {
		super();
		this.energy = 0;
	}

	roomAdded(room) {
		this.energy += room.metadata.energy;
		updateStat("energyStat", this.energy, this.energy < 0, this);
	}

	roomRemoved(room) {
		this.energy -= room.metadata.energy;
		updateStat("energyStat", this.energy, this.energy < 0, this);
	}

	getRoomWarning(roomMetaData) {
		if (this.energy + roomMetaData.energy < 0) {
			return this.toString();
		} else {
			return null;
		}
	}

	getGlobalError() {
		return this.energy < 0 ? this.toString() : null;
	}

	toString() {
		return "Energy required";
	}
}

class CapacityRule extends RoomRule {
	constructor() {
		super();
		this.capacity = 0;
	}

	roomAdded(room) {
		this.capacity += room.metadata.capacity;
		updateStat("capacityStat", this.capacity, this.capacity < 0, this);
	}

	roomRemoved(room) {
		this.capacity -= room.metadata.capacity;
		updateStat("capacityStat", this.capacity, this.capacity < 0, this);
	}

	getRoomWarning(roomMetaData) {
		if (this.capacity + roomMetaData.capacity < 0) {
			return this.toString();
		} else {
			return null;
		}
	}

	getGlobalError() {
		return this.capacity < 0 ? this.toString() : null;
	}

	toString() {
		return "Capacity required";
	}
}

class MaxNumRule extends RoomRule {
	constructor(roomMetadata, maxnum) {
		super();
		this.id = roomMetadata.id;
		this.maxnum = maxnum;
		this.list = Array();
		this.errorMessage = "Limit " + maxnum + " " + roomMetadata.name + (maxnum == 1 ? "" : " rooms");
	}

	roomAdded(room) {
		this.roomChanged(room, true);
	}

	roomRemoved(room) {
		this.roomChanged(room, false);
	}

	roomChanged(room, added) {
		if (room.metadata.id == this.id) {
			var prevLength = this.list.length;
			if (added) {
				addToListIfNotPresent(this.list, room);
			} else {
				removeFromList(this.list, room);
			}
			var newLength = this.list.length;
			if (prevLength <= this.maxnum && newLength > this.maxnum) {
				for (var r = 0; r < this.list.length; r++) {
					this.list[r].addRuleError(this);
				}
			} else if (prevLength > this.maxnum && newLength <= this.maxnum) {
				for (var r = 0; r < this.list.length; r++) {
					this.list[r].removeRuleError(this);
				}
			} else if (newLength > this.maxnum) {
				room.addRuleError(this);
			}
		}
	}

	getRoomWarning(roomMetaData) {
		if (roomMetaData.id == this.id && this.list.length >= this.maxnum) {
			return this.toString();
		} else {
			return null;
		}
	}

	toString() {
		return this.errorMessage;
	}
}

class PrereqRule extends RoomRule {
	constructor(roomMetadata, prereqRoomMetadata) {
		super();
		this.room_id = roomMetadata.id;
		this.prereq_id = prereqRoomMetadata.id;
		this.room_list = Array();
		this.prereq_list = Array();
		this.errorMessage = prereqRoomMetadata.name + " required";
	}

	roomAdded(room) {
		this.roomChanged(room, true);
	}

	roomRemoved(room) {
		this.roomChanged(room, false);
	}

	roomChanged(room, added) {
		if (room.metadata.id == this.room_id) {
			if (added) {
				if (addToListIfNotPresent(this.room_list, room) && this.prereq_list.length == 0) {
					room.addRuleError(this);
				}
			} else {
				removeFromList(this.room_list, room);
			}
		} else if (room.metadata.id == this.prereq_id) {
			var prevLength = this.prereq_list.length;
			if (added) {
				addToListIfNotPresent(this.prereq_list, room);
			} else {
				removeFromList(this.prereq_list, room);
			}
			var newLength = this.prereq_list.length;
			if (prevLength > 0 && newLength == 0) {
				for (var r = 0; r < this.room_list.length; r++) {
					this.room_list[r].addRuleError(this);
				}
			} else if (prevLength <= 0 && newLength > 0) {
				for (var r = 0; r < this.room_list.length; r++) {
					this.room_list[r].removeRuleError(this);
				}
			}
		}
	}

	getRoomWarning(roomMetaData) {
		if (roomMetaData.id == this.room_id && this.prereq_list.length == 0) {
			return this.toString();
		} else {
			return null;
		}
	}

	toString() {
		return this.errorMessage;
	}
}

class SpawnRule extends RoomRule {
	constructor() {
		super();
		this.room_list = Array();
	}

	roomAdded(room) {
		this.roomChanged(room, true);
	}

	roomRemoved(room) {
		this.roomChanged(room, false);
	}

	roomChanged(room, added) {
		if (room.metadata.spawn) {
			var prevLength = this.room_list.length;
			if (added) {
				addToListIfNotPresent(this.room_list, room);
			} else {
				removeFromList(this.room_list, room);
			}
			var newLength = this.room_list.length;
			if (prevLength > 0 && newLength == 0) {
				addAllError(this.toString());
			} else if (prevLength <= 0 && newLength > 0) {
				removeAllError(this.toString());
			}
		}
	}

	toString() {
		return "Spawn room required";
	}
}

var roomRules = Array();

function registerRoomRules(roomMetaDataList) {
	roomRules.push(new RoomCountRule(roomMetaDataList.general.max_rooms));
	roomRules.push(new EnergyRule());
	roomRules.push(new CapacityRule());
	roomRules.push(new SpawnRule());

	for (var i = 0; i < roomMetaDataList.rooms.length; i++) {
		var roomMetadata = roomMetaDataList.rooms[i];
		if (roomMetadata.maxnum && roomMetadata.maxnum > 0) {
			roomRules.push(new MaxNumRule(roomMetadata, roomMetadata.maxnum));
		}

		if (roomMetadata.prereq) {
			roomRules.push(new PrereqRule(roomMetadata, getRoomMetadata(roomMetadata.prereq)));
		}
	}
}

function runRulesOnRoomAdded(room) {
	for (var i = 0; i < roomRules.length; i++) {
		roomRules[i].roomAdded(room);
	}
}

function runRulesOnRoomRemoved(room) {
	for (var i = 0; i < roomRules.length; i++) {
		roomRules[i].roomRemoved(room);
	}
}

function getNewRoomWarnings(roomMetaData) {
	var errors = Array();
	for (var i = 0; i < roomRules.length; i++) {
		var warning = roomRules[i].getRoomWarning(roomMetaData);
		if (warning) {
			errors.push(warning);
		}
	}
	return errors.length > 0 ? errors : null;
}

function getGlobalErrors() {
	var errors = Array();
	for (var i = 0; i < roomRules.length; i++) {
		var error = roomRules[i].getGlobalError();
		if (warning) {
			errors.push(warning);
		}
	}
	return errors.length > 0 ? errors : null;
}