class RoomRule {
	roomAdded(room) {
	}

	roomRemoved(room) {
	}

	getNewRoomError(roomMetaData, num=1) {
		return null;
	}

	getNewRoomWarning(roomMetaData, num=1) {
		return null;
	}

	getNewDojoError() {
		return null;
	}

	getNewDojoWarning() {
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
	    if (room.metadata.num != null) {
            this.numRooms += room.metadata.num;

	    } else {
    		this.numRooms++;
	    }
		updateStat("numRoomsStat", this.numRooms, this.numRooms > this.maxRooms, this);
	}

	roomRemoved(room) {
	    if (room.metadata.num != null) {
            this.numRooms -= room.metadata.num;

	    } else {
    		this.numRooms--;
	    }

		updateStat("numRoomsStat", this.numRooms, this.numRooms > this.maxRooms, this);
	}

	getNewRoomError(roomMetaData, num=1) {
	    if (roomMetaData.num != null) {
            num = roomMetaData.num;
	    }
		if (this.numRooms + num > this.maxRooms) {
			return this.toString();
		} else {
			return null;
		}
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

	getNewRoomError(roomMetaData, num=1) {
		if (this.energy + (roomMetaData.energy * num) < 0) {
			return this.toString();
		} else {
			return null;
		}
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

	getNewRoomError(roomMetaData, num=1) {
		if (this.capacity + (roomMetaData.capacity * num) < 0) {
			return this.toString();
		} else {
			return null;
		}
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

	getNewRoomError(roomMetaData, num=1) {
		if (roomMetaData.id == this.id && (this.list.length + num) > this.maxnum) {
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
				} else {
                    room.removeRuleError(this);
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

	getNewRoomError(roomMetaData, num=1) {
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
	
	getNewDojoError() {
		return this.toString();
	}

	toString() {
		return "Spawn room required";
	}
}

class DiscontinuedRule extends RoomRule {
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
		if (room.metadata.discontinued) {
			var prevLength = this.room_list.length;
			if (added) {
				addToListIfNotPresent(this.room_list, room);
				room.addRuleWarning(this);
			} else {
				removeFromList(this.room_list, room);
			}
			var newLength = this.room_list.length;
			if (prevLength > 0 && newLength == 0) {
				removeAllWarning("Discontinued rooms");

			} else if (prevLength <= 0 && newLength > 0) {
				addAllWarning("Discontinued rooms");
			}
		}
	}

	getNewRoomWarning(roomMetaData, num=1) {
		if (roomMetaData.discontinued) {
			return this.toString();

		} else {
			return null;
		}
	}

	toString() {
		return "Discontinued room";
	}
}

class RoomCounter extends RoomRule {
	constructor() {
		super();
		this.room_counts = {};
	}

	roomAdded(room) {
	    var id = room.metadata.id;
	    if (!this.room_counts[id]) {
	        this.room_counts[id] = 0;
	    }
        this.room_counts[id]++;
	}

	roomRemoved(room) {
	    var id = room.metadata.id;
	    if (this.room_counts[id]) {
	        this.room_counts[id]--;
	    }
	}

	getRoomCount(metadata) {
	    var id = metadata.id;
	    var count = this.room_counts[id];
	    return count ? count : 0
	}

	toString() {
		return "room counter";
	}
}

class ResourceCounter extends RoomRule {
	constructor() {
		super();
		this.resources = {};
		this.tier = 0;
		this.maxTier = 4;
	}

	getTier() {
	    return Math.min(this.tier, this.maxTier);
	}

	roomAdded(room) {
	    if (room.metadata.id == "b1") {
	        this.tier++;
	    }

	    var tier = this.getTier();

	    this.addResources(this.resources, room.metadata);
	}

	addResources(resourceMap, metadata) {
	    var rr = metadata.resources;
	    for (var i = 0; i < rr.length; i++) {
	        if (!resourceMap[rr[i].resource]) {
	            resourceMap[rr[i].resource] = [];
	            for (var j = 0; j <= this.maxTier; j++) {
	                resourceMap[rr[i].resource][j] = 0;
	            }
	        }
            for (var j = 0; j <= this.maxTier; j++) {
                resourceMap[rr[i].resource][j] += rr[i].costs[j];
            }
	    }
	}

	roomRemoved(room) {
	    if (room.metadata.id == "b1") {
	        this.tier--;
	    }

	    var tier = this.getTier();

	    var rr = room.metadata.resources;
	    for (var i = 0; i < this.resources.length; i++) {
            for (var j = 0; j <= this.maxTier; j++) {
                this.resources[rr[i].resource][j] -= rr[i].costs[j];
            }
	    }
	}

	getResourcesForRoomMetadata(metadata) {
	    // ugh just convert it to a dict
	    var resourcesMap = {};
	    this.addResources(resourcesMap, metadata);
	    return this.getResources0(resourcesMap);
	}

	getTotalResources() {
	    return this.getResources0(this.resources);
	}

	getResources0(resourceMap) {
	    var tier = this.getTier();

	    var sortedKeys = keys(resourceMap).sort();

	    var costs = {};

	    for (var i = 0; i < sortedKeys.length; i++) {
	        var key = sortedKeys[i];
	        var cost = resourceMap[key][tier];
	        if (cost > 0) {
	            costs[key] = cost;
	        }
	    }

	    return costs;
	}

	toString() {
		return "resource tracker";
	}
}

var roomCounter = new RoomCounter();
var resourceCounter = new ResourceCounter();

var roomRules = Array();

function registerRoomRules(roomMetaDataList) {
	roomRules.push(new RoomCountRule(roomMetaDataList.general.max_rooms));
	roomRules.push(new EnergyRule());
	roomRules.push(new CapacityRule());
	roomRules.push(new SpawnRule());
	roomRules.push(new DiscontinuedRule());
	roomRules.push(roomCounter);
	roomRules.push(resourceCounter);

	for (var i = 0; i < roomMetaDataList.rooms.length; i++) {
		var roomMetadata = roomMetaDataList.rooms[i];
		if (roomMetadata.maxnum && roomMetadata.maxnum > 0) {
			roomRules.push(new MaxNumRule(roomMetadata, roomMetadata.maxnum));
		}

		if (roomMetadata.prereq) {
			roomRules.push(new PrereqRule(roomMetadata, getRoomMetadata(roomMetadata.prereq)));
		}
	}
	
	for (var i = 0; i < roomRules.length; i++) {
		var error = roomRules[i].getNewDojoError();
		if (error) {
			addAllError(error);
		}
	}

	for (var i = 0; i < roomRules.length; i++) {
		var warn = roomRules[i].getNewDojoWarning();
		if (warn) {
			addAllWarn(warn);
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

function getNewRoomErrors(roomMetaData, num=1) {
	var errors = Array();
	for (var i = 0; i < roomRules.length; i++) {
		var error = roomRules[i].getNewRoomError(roomMetaData, num);
		if (error) {
			errors.push(error);
		}
	}
	return errors.length > 0 ? errors : null;
}

function getNewRoomWarnings(roomMetaData) {
	var warnings = Array();
	for (var i = 0; i < roomRules.length; i++) {
		var warning = roomRules[i].getNewRoomWarning(roomMetaData, num=1);
		if (warning) {
			warnings.push(warning);
		}
	}
	return warnings.length > 0 ? warnings : null;
}