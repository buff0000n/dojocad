// if it's worth engineering it's worth overengineering -B

// don't need much of a delay, if someone's sitting on the undo button we'll just end up canceling a bunch of runs
var treeUpdateDelay = 50;
var treeUpdateTimeout = null;
// track if there has ever been a tree update
var ranATreeUpdate = false;

function treeUpdated() {
    // cancel any pending tree traversal, this is useful for when the user sits on the undo button or otherwise
    // does a bunch of actions really fast
	if (treeUpdateTimeout) {
		clearTimeout(treeUpdateTimeout);
	}

    // schedule tree analysis
	treeUpdateTimeout = setTimeout(actuallyUpdateTree, treeUpdateDelay);
}

// static rule we can add as a warning to disconected rooms
class DisconnectedRule {
    toString() { return "Disconnected room"; }
}
var disconnectedRule = new DisconnectedRule();

// static rule we can add as a warning to rooms in a loop
class LoopedRule {
    toString() { return "Room in a loop"; }
}
var loopedRule = new LoopedRule();

function actuallyUpdateTree() {
    // clear timeout reference
    treeUpdateTimeout = null;

    // short circuit if there is no root and there has never been a root
    var root = getCurrentSpawnRoom();
    if (!root) {
        if (ranATreeUpdate) {
            // if there is no spawn point but there was at some time then just clear all warnings
            for (var r = 0; r < roomList.length; r++) {
                roomList[r].removeRuleWarning(disconnectedRule);
                roomList[r].removeRuleWarning(loopedRule);
            }
            removeAllWarning("Disconnected rooms");
            removeAllWarning("Loops present");
        }
        return;
    }
	ranATreeUpdate = true;

    // keep a running tally of disconnected rooms for the final warning update
    disconnectedCount = 0;

    // start a tree traversal, depth-first, allow repeats
    startTreeTraversal("connected", root, 25, new TreeStructureCallback());
}

class AbstractTreeTraversalCallback {
    preProcess(room) { return; /* no return value */ }
    processConnection(room, incomingDoors) { return false; /* returns true if traversal should continue through this room */ }
    processLoop(room, loopingDoors) { return; /* no return value */ }
    postProcess(room) { return; /* no return value */ }
    end() { return; }
}

class TreeStructureCallback extends AbstractTreeTraversalCallback {
    constructor() {
        super();
        // keep a running tally of disconnected rooms for the final warning update
        this.disconnectedCount = 0;
        // keep a running tally of looped rooms for the final warning update
        this.loopedCount = 0;
    }

    preProcess(room) {
        // pre-process on all rooms: clear any connected and outgoing flags
        room.connected = false;
        room.looped = false;
        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            door.outgoing = false;
            door.looping = false;
        }
    }

    processConnection(room, incomingDoors) {
        // skip rooms that don't count, like the label object
        if (room.metadata.num == 0) {
            // don't continue traversal through this room
            return false;
        }

//        console.log(room.metadata.id + " #" + room.id + " is connected");
        room.connected = true;
        for (var d = 0; d < incomingDoors.length; d++) {
            incomingDoors[d].otherDoor.outgoing = true;
        }
        return true;
    }

    processLoop(room, incomingDoors) {
//        console.log(room.metadata.id + " #" + room.id + " is looped");

        room.looped = true;
        for (var d = 0; d < incomingDoors.length; d++) {
            incomingDoors[d].looping = true;
            incomingDoors[d].otherDoor.looping = true;
        }
    }

    postProcess(room) {
        // post-process on all rooms: check if any connected flags are not set
        if (room.connected) {
            // remove any disconnected warnings
            room.removeRuleWarning(disconnectedRule);

        // if the room isn't a label object then count it as disconneted
        } else if (room.metadata.num != 0) {
            // if the room is not connected, add a warning
            room.addRuleWarning(disconnectedRule);
            // increment the count
            this.disconnectedCount += 1;
        }

        // loop check
        if (room.looped && settings.loopChecking) {
            room.addRuleWarning(loopedRule);
            this.loopedCount += 1;

        } else {
            room.removeRuleWarning(loopedRule);
        }

        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            if (door.outgoing) {
                if (door.otherDoor.outgoing) {
                    // add loop half-arrow
                } else {
                    // add normal arror
                }
            } else {
                // remove arrow
            }
        }
    }

    end() {
        // check the count
        if (this.disconnectedCount > 0) {
            // make sure there's a global warning displayed
            addAllWarning("Disconnected rooms");

        } else {
            // remove the global warning if present
            removeAllWarning("Disconnected rooms");
        }

        // check the count
        if (this.loopedCount > 0 && settings.loopChecking) {
            // make sure there's a global warning displayed
            addAllWarning("Loops present");

        } else {
            // remove the global warning if present
            removeAllWarning("Loops present");
        }
    }
}

//////////////////////////////////////////////////////////////////////////
// relatively generic tree traversal function
//////////////////////////////////////////////////////////////////////////

// track running traversals
var treeTraversals = {};

function startTreeTraversal(name, root, batchSize, callback) {
    // cancel any existing tree traversal with the same name
    cancelTreeTraversal(name);

    // create a new traversal
    var tt = new TreeTraversal(name, root, batchSize, callback);
    // register it
    treeTraversals[name] = tt;
    // start it
    tt.start();
}

function cancelTreeTraversal(name) {
    // cancel the tree traversal with the given name, if present
    if (treeTraversals[name]) {
		treeTraversals[name].cancel();
		treeTraversals[name] = null;
    }
}

class TreeTraversalMarker {
    constructor(room) {
        this.room = room;

        this.nextRoom = null;
        this.nextDoors = null;
    }
}

// handler object for a tree traversal
class TreeTraversal {
    constructor(name, root, batchSize, callback) {
        // tracking name
        this.name = name;
        // maximum number of callbacks to run for each timer batch
        this.batchSize = batchSize;
        // start point
        this.root = root;
        // AbstractTreeTraversalCallback
        this.callback = callback;

        // state
        // timeout object
        this.timeout = null;
        // work queue, used differently in the first three phases
        this.runList = null;
        // running count of callbacks executed in the current batch
        this.count = 0;
    }

    schedule(fun) {
        // just a basic runLater()
        this.timeout = setTimeout(fun, 1);
    }

    cancel() {
        // check the timeout object and cancel it
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        // unregister this tree traversal, if still registered
        if (treeTraversals[this.name] == this) {
            treeTraversals[this.name] == null;
        }
    }

    start() {
        // schedule the start
	    this.schedule(() => { this.runPre(); });
    }

    checkStillRunning() {
        // convenient place to clear the timeout object
        this.timeout = null;
        // check if we're still registered
        return treeTraversals[this.name] == this;
    }

    runPre() {
        // check
        if (!this.checkStillRunning()) {
            return;
        }

        // pre-processing callback is optional
        if (this.callback.preProcess) {
            // initialize the work queue if not initialized
            if (!this.runList) {
                // get a copy of the whole room list
                this.runList = roomList.slice();
            }

            // run callbacks until the work queue is drained or we hit the batch size
            while (this.runList.length > 0 && this.count < this.batchSize) {
                // increment count
                this.count += 1;
                // remove the first element and run the pre-processing callback on it
                this.callback.preProcess(this.runList.shift());
            }

            // check if we're done
            if (this.runList.length > 0) {
                // reset the batch count
                this.count = 0;
                // schedule another batch
                this.schedule(() => { this.runPre(); });
                // end early
                return;
            }
        }

        // fell through, so this step is done
        // clear state
        this.runList = null;
        // start traversal directly with whatever batch amount we have left
        this.runTraversal();
    }

    hasMarker(room) {
        // check if the room has been visited by this traversal
        return room.traversalMarker && room.traversalMarker.has(this);
    }

    getMarker(room) {
        // mark the room as having been visited by this traversal
        if (!room.traversalMarker) {
            room.traversalMarker = new Map();
        }
        if (!room.traversalMarker.has(this)) {
            room.traversalMarker.set(this, new TreeTraversalMarker(room));
        }
        return room.traversalMarker.get(this);
    }

    clearMarker(room) {
        // clear the marker for this traversal from the room and check if the marker list is empty
        if (room.traversalMarker && room.traversalMarker.delete(this) && room.traversalMarker.size == 0) {
            // clean up if there are no more traversals running on the room
            room.traversalMarker = null;
        }
    }

    reverseDoors(doors) {
        var otherDoors = [];
        for (var d = 0; d < doors.length; d++) {
            otherDoors.push(doors[d].otherDoor);
        }
        return otherDoors;
    }

//    printState() {
//        var s = "";
//        var room = this.root;
//        var printed = [];
//        do {
//            s = s + " -> " + room.metadata.id + "#" + room.id;
//            if (printed.includes(room)) { break; }
//            printed.push(room);
//            room = this.getMarker(room).nextRoom;
//
//        } while (room && printed.length < 50);
//
//        s = s + " [";
//
//        for (var i = 0; i < this.runList.length; i++) {
//            if (i > 0) s = s + ", ";
//            s = s + this.runList[i][0].metadata.id + "#" + this.runList[i][0].id;
//        }
//        s = s + "]";
//
//        console.log("tree " + s);
//    }

    runTraversal() {
        // check
        if (!this.checkStillRunning()) {
            return;
        }

        // initialize the work queue with the root room and no incoming doors
        if (!this.runList) {
            this.runList = [ [this.root, []] ];
        }

        // run callbacks until there are no more rooms to visit or we hit the batch size
        while (this.runList.length > 0 && this.count < this.batchSize) {
//            this.printState();
            // pull the next room, incoming door(s), and looped flag off the queue
            var [room, doors, looped] = this.runList.shift();

            if (looped) {
                // just call the callback and continue
                this.count += 1;
                this.callback.processLoop(room, doors);
                continue;
            }

            // get the room marker for this traversal
            var roomMarker = this.getMarker(room);

            // make sure the linkage is correct on the previous room
            if (doors.length > 0) {
                var prevRoomMarker = this.getMarker(doors[0].otherDoor.room);
                prevRoomMarker.nextRoom = room;
                prevRoomMarker.nextDoors = doors;
            }

            if (roomMarker.nextRoom) {
                // loop detected

                // reverse engineer the existing runList entry for connecting the last door in the loop
                var clipDoors = this.reverseDoors(doors);
                var clipRoom = clipDoors[0].room;
                // remove the entry from the run list so we don't process the loop twice
                if (!removeFirstMatchFromList(this.runList, (item) => {
                    return item[0] == clipRoom && arrayEquals(item[1], clipDoors) && !item[2];
                })) {
                    console.log("whoopsie");
                }

                // loop over the current linked tree path until we get back to the same room
                do {
                    // put loop processing at the beginning of the work queue, in reverse order
                    // use the outgoing doors as incoming
                    this.runList.unshift([roomMarker.room, this.reverseDoors(roomMarker.nextDoors), true]);
                    // get the next room
                    roomMarker = this.getMarker(roomMarker.nextRoom);
                } while (roomMarker.room != room)

                // go back and process the first loop entry
                continue;
            }

            // run the call back and see if the traversal should continue through this room
            this.count += 1;
            if (this.callback.processConnection(room, doors)) {
                // get the next rooms, excluding the incoming doors
                var nextRooms = [];
                for (var d = 0; d < room.doors.length; d++) {
                    var door = room.doors[d];
                    if (door.otherDoor && !doors.includes(door)) {
                        addToListIfNotPresent(nextRooms, door.otherDoor.room);
                    }
                }
                if (nextRooms.length > 0) {
                    for (var r = 0; r < nextRooms.length; r++) {
                        var nextRoom = nextRooms[r];
                        // get the connecting doors, there may be more than one
                        var otherDoors = [];
                        for (var d = 0; d < room.doors.length; d++) {
                            var door = room.doors[d];
                            if (door.otherDoor && door.otherDoor.room == nextRoom) {
                                otherDoors.push(door.otherDoor);
                            }
                        }
                        if (otherDoors.length == 0) {
                            console.log("oopsie");
                        }
                        // for depth first, put new nodes at the beginning of the queue
                        this.runList.unshift([nextRoom, otherDoors, false]);
                        // set this room's marker state
                        roomMarker.nextRoom = nextRoom;
                        roomMarker.nextDoors = otherDoors;
                    }
                }
            }
        }

        // check if we're done
        if (this.runList.length > 0) {
            // reset the batch count
            this.count = 0;
            // schedule another batch
    	    this.schedule(() => { this.runTraversal(); });

        } else {
            // clear state
            this.runList = null;
            // start post-processing directly with whatever batch amount we have left
            this.runPost();
        }
    }

    runPost() {
        // check
        if (!this.checkStillRunning()) {
            return;
        }

        // initialize the work queue if not initialized
        if (!this.runList) {
            // get a copy of the whole room list
            this.runList = roomList.slice();
        }

        // run callbacks until the work queue is drained or we hit the batch size
        while (this.runList.length > 0 && this.count < this.batchSize) {
            // remove the first element and
            var room = this.runList.shift();
            // post-processing callback is optional
            if (this.callback.postProcess) {
                // increment count
                this.count += 1;
                // run the pre-processing callback on it
                this.callback.postProcess(room);
            }
            // clear the visited flag, do this regardless of whether there's a post-processing function specified
            this.clearMarker(room);
        }

        // check if we're done
        if (this.runList.length > 0) {
            // reset the batch count
            this.count = 0;
            // schedule another batch
            this.schedule(() => { this.runPost(); });
            // end early
            return;
        }

        // fell through, so this step is done
        // clear state
        this.runList = null;
        // always run the final call back later
        this.schedule(() => { this.runEnd(); });
    }

    runEnd() {
        // check
        if (!this.checkStillRunning()) {
            return;
        }

        // end callback is optional
        if (this.callback.end) {
            this.callback.end();
        }

        // clean up
        this.cancel();
    }
}
