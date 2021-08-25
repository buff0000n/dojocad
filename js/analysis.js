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

class AnalysisResult {
    constructor() {
        this.spawn = false;
        this.disconnected = false;
        this.loops = false;
        this.ambiguous = false;
    }

    setSpawn(spawn) {
        if (!spawn && settings.structureChecking) {
            // make sure there's a global warning displayed
            addAllWarning(spawnPointMissingRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(spawnPointMissingRule.globalMessage);
        }
        this.spawn = spawn;
        if (spawn) {
            this.setDisconnected(false);
            this.setLoops(false);
            this.setAmbiguous(false);
        }
    }

    setDisconnected(disconnected) {
        if (disconnected) {
            // make sure there's a global warning displayed
            addAllWarning(disconnectedRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(disconnectedRule.globalMessage);
        }
        this.disconnected = disconnected;
    }

    setLoops(loops) {
        if (loops && settings.structureChecking) {
            // make sure there's a global warning displayed
            addAllWarning(loopedRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(loopedRule.globalMessage);
        }
        this.loops = loops;
    }

    setAmbiguous(ambiguous) {
        // todo: pretty sure these can't happen now
        if (ambiguous && settings.structureChecking) {
            // make sure there's a global warning displayed
            addAllWarning(ambiguousRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(ambiguousRule.globalMessage);
        }
        this.ambiguous = ambiguous;
    }

}

var analysisResult = new AnalysisResult();

// static rule we can add as a warning to disconected rooms
class SpawnPointMissingRule {
    constructor() {
        this.globalMessage = "Spawn Point Missing";
    }
}
var spawnPointMissingRule = new SpawnPointMissingRule();

// static rule we can add as a warning to disconected rooms
class DisconnectedRule {
    constructor() {
        this.globalMessage = "Disconnected rooms";
    }
    toString() { return "Disconnected room"; }
}
var disconnectedRule = new DisconnectedRule();

// static rule we can add as a warning to rooms in a loop
class LoopedRule {
    constructor() {
        this.globalMessage = "Loops present";
    }
    toString() { return "Room in a loop"; }
}
var loopedRule = new LoopedRule();

// static rule we can add as a warning to ambiguous rooms with incoming doors coming from more than one other room
// todo: pretty sure these can't happen now
class AmbiguousRule {
    constructor() {
        this.globalMessage = "Ambiguous rooms present";
    }
    toString() { return "Ambiguous room"; }
}
var ambiguousRule = new AmbiguousRule();

function actuallyUpdateTree() {
    // clear timeout reference
    treeUpdateTimeout = null;

    // short circuit if there is no root and there has never been a root
    var root = getCurrentSpawnRoom();
    if (!root) {
        if (ranATreeUpdate) {
            // if there is no spawn point but there was at some time then just clear all warnings
            for (var r = 0; r < roomList.length; r++) {
                var room = roomList[r];
                room.removeRuleWarning(disconnectedRule);
                room.removeRuleWarning(loopedRule);
                // clear the room flags
                room.connected = false;
                room.looped = false;
                // clear the door flags
                for (var d = 0; d < room.doors.length; d++) {
                    var door = room.doors[d];
                    door.outgoing = false;
                    door.crossBranch = false;
                    door.looping = false;
                }
                // remove the lines and arrors
                room.showTree();
            }
        }
        analysisResult.setSpawn(false);
        return;
    }
	ranATreeUpdate = true;

    // keep a running tally of disconnected rooms for the final warning update
    disconnectedCount = 0;

    // start a depth-first tree traversal
    startTreeTraversal("connected", true, root, 25, new TreeStructureCallback());
}

function autoSetCrossBranches() {
    // short circuit if there is no root and there has never been a root
    var root = getCurrentSpawnRoom();
    if (!root) {
        return;
    }

    // start a breadth-first tree traversal
    startTreeTraversal("autobranch", false, root, 25, new AutoCrossBranchCallback());
}

function runBranchSelection(room, toLeaf) {
    if (!room) {
        return;
    }

    // start a breadth-first tree traversal
    startTreeTraversal("selectbranch", false, room, 25, new SelectBranchCallback(toLeaf));
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
        // keep a running tally of ambiguous rooms for the final warning update
        this.ambiguousCount = 0;
    }

    preProcess(room) {
        // pre-process on all rooms: clear any connected and outgoing flags
        room.connected = false;
        room.looped = false;
        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            door.outgoing = false;
            door.crossBranch = door.forceCrossBranch;
            door.looping = false;
        }
        // room.setLabel(room.id);
        // room.setLabelScale(0.25);
    }

    processConnection(room, incomingDoors) {
        room.connected = true;
        for (var d = 0; d < incomingDoors.length; d++) {
            incomingDoors[d].otherDoor.outgoing = true;
        }
        return true;
    }

    processLoop(room, incomingDoors) {
        room.looped = true;
        for (var d = 0; d < incomingDoors.length; d++) {
            incomingDoors[d].looping = true;
            incomingDoors[d].otherDoor.looping = true;
        }
    }

    postProcess(room) {
        // post-process on all rooms: check if any connected flags are not set

        // skip label objects
        if (room.metadata.num == 0) {
            return;
        }

        if (room.connected) {
            // remove any disconnected warnings
            room.removeRuleWarning(disconnectedRule);

        } else {
            // if the room is not connected, add a warning
            room.addRuleWarning(disconnectedRule);
            // increment the count
            this.disconnectedCount += 1;
        }

        // loop check
        if (room.looped && settings.structureChecking) {
            room.addRuleWarning(loopedRule);
            this.loopedCount += 1;

        } else {
            room.removeRuleWarning(loopedRule);
        }

        if (room.connected && !room.looped) {
            var incomingRooms = [];
            for (var d = 0; d < room.doors.length; d++) {
                var door = room.doors[d];
                // needs to be connected to a traversable room
                if (door.otherDoor && isTraversableRoom(door.otherDoor.room)) {
                    if (!door.outgoing && !door.otherDoor.outgoing) {
                        door.crossBranch = true;
                    }
                    if (!door.outgoing && door.otherDoor.outgoing) {
                        addToListIfNotPresent(incomingRooms, door.otherDoor.room);
                    }
                }
            }

            // todo: pretty sure these can't happen now
            if (incomingRooms.length > 1 && settings.structureChecking) {
                room.addRuleWarning(ambiguousRule);
                this.ambiguousCount += 1;

            } else {
                room.removeRuleWarning(ambiguousRule);
            }
        }

        // always refresh the tree display, in case we need to remove it
        room.showTree();
    }

    end() {
        // make sure we know there's a spawn point
        analysisResult.setSpawn(true);

        // check the disconnected count
        analysisResult.setDisconnected(this.disconnectedCount > 0);

        // check the loop count
        analysisResult.setLoops(this.loopedCount > 0);

        // check the ambiguous count
        // todo: pretty sure these can't happen now
        analysisResult.setAmbiguous(this.ambiguousCount > 0);
    }
}

class AutoCrossBranchCallback extends AbstractTreeTraversalCallback {
    constructor() {
        super();
        this.postProcess = null;

        this.autoCrossBranchDoors = [];
    }

    preProcess(room) {
        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            door.crossBranch = door.forceCrossBranch;
        }
    }

    processConnection(room, incomingDoors) {
        return true;
    }

    processLoop(room, incomingDoors) {
        for (var d = 0; d < incomingDoors.length; d++) {
            this.autoCrossBranchDoors.push(incomingDoors[d]);
        }
    }

    end() {
        startUndoCombo();
        for (var d = 0; d < this.autoCrossBranchDoors.length; d++) {
            setDoorForceCrossBranch(this.autoCrossBranchDoors[d], true, true);
        }
        endUndoCombo("Auto-fix structure");
    }
}

class SelectBranchCallback extends AbstractTreeTraversalCallback {
    constructor(toLeaf) {
        super();
        this.toLeaf = toLeaf;
        this.postProcess = null;
        this.preProcess = null;

        this.selection = [];
    }

    processConnection(room, incomingDoors) {
        if (incomingDoors && incomingDoors.length > 0 && this.toLeaf == incomingDoors[0].outgoing) {
            return false;
        }
        this.selection.push(room);
        return true;
    }

    processLoop(room, incomingDoors) { }

    end() {
        selectRooms(this.selection);
    }
}

//////////////////////////////////////////////////////////////////////////
// public utils
//////////////////////////////////////////////////////////////////////////

function getDoorsToRoom(room, toRoom) {
    var nextDoors = [];
    for (var d = 0; d < room.doors.length; d++) {
        var door = room.doors[d];
        if (door.otherDoor && door.otherDoor.room == toRoom) {
            nextDoors.push(door);
        }
    }
    return nextDoors;
}

function reverseDoors(doors) {
    if (doors == null) {
        console.log("oopsie");
    }
    var otherDoors = [];
    for (var d = 0; d < doors.length; d++) {
        otherDoors.push(doors[d].otherDoor);
    }
    return otherDoors;
}

function isTraversableRoom(room) {
    // skip rooms that don't count, like the label object
    if (room.metadata.num == 0) {
        // don't continue traversal through this room
        return false;
    }
    return true;
}

//////////////////////////////////////////////////////////////////////////
// depth-first generic tree traversal function
//////////////////////////////////////////////////////////////////////////

// track running traversals
var treeTraversals = {};

function startTreeTraversal(name, depthFirst, root, batchSize, callback) {
    // cancel any existing tree traversal with the same name
    cancelTreeTraversal(name);

    // create a new traversal
    var tt = depthFirst ?
        new DepthFirstTreeTraversal(name, root, batchSize, callback) :
        new BreadthFirstTreeTraversal(name, root, batchSize, callback);
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

// handler object for a tree traversal
class AbstractTreeTraversal {
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
        return room.traversalMarker && room.traversalMarker.includes(this);
    }

    setMarker(room) {
        // mark the room as having been visited by this traversal
        if (!room.traversalMarker) {
            room.traversalMarker = [];
        }
        if (!room.traversalMarker.includes(this)) {
            room.traversalMarker.push(this);
            return true;
        }
        return false;
    }

    clearMarker(room) {
        // clear the marker for this traversal from the room and check if the marker list is empty
        if (room.traversalMarker && removeFromList(room.traversalMarker, this) && room.traversalMarker.length == 0) {
            // clean up if there are no more traversals running on the room
            room.traversalMarker = null;
        }
    }

    runTraversal() {
        // check
        if (!this.checkStillRunning()) {
            return;
        }

        // initialize the work stack with an entry for the root room and no entry doors
        if (!this.runList) {
            this.runList = [ new TreeTraversalEntry(this.root, []) ];
        }

        // run callbacks until there are no more rooms to visit or we hit the batch size
        while (this.runList.length > 0 && this.count < this.batchSize) {
            this.count += 1;
            this.traverseUnit();
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

    traverseUnit() {
        throw "Not implemented";
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

class TreeTraversalEntry {
    constructor(room, entryDoorList) {
        this.room = room;
        this.entryDoorList = entryDoorList;

        this.exitDoorLists = null;
        this.loopQueue = null;
    }
}

class DepthFirstTreeTraversal extends AbstractTreeTraversal {
    constructor(name, root, batchSize, callback) {
        super(name, root, batchSize, callback);
    }

//    printState() {
//        var s = "Stack: ";
//        var room = this.root;
//        for (var i = 0; i < this.runList.length; i++) {
//            if (i > 0) s = s + " <- ";
//            s = s + this.runList[i].room.toShortString() + (this.runList[i].exitDoorLists ? ("[" + this.runList[i].exitDoorLists.length + "]") : "...");
//        }
//        console.log(s);
//    }

    traverseUnit() {
        // get the current room
        var currentEntry = this.runList[0];

        if (currentEntry.loopQueue) {
            var [loopRoom, loopDoors] = currentEntry.loopQueue.pop();
            if (currentEntry.loopQueue.length == 0) {
                currentEntry.loopQueue = null;
            }
            // console.log("processing loop at " + loopRoom.toShortString());
            // just call the callback and continue
            this.callback.processLoop(loopRoom, loopDoors);
            return;
        }

        // this.printState();

        // see if we've already processed this room
        if (!currentEntry.exitDoorLists) {
            // initialize
            currentEntry.exitDoorLists = [];
            // run the call back and see if the traversal should continue through this room
            // make this easier
            var room = currentEntry.room;
            var doors = currentEntry.entryDoorList;
            // set the marker
            this.setMarker(room);
            // run the callback and see if we should traverse the room
            if (isTraversableRoom(room) && this.callback.processConnection(room, doors)) {
                // get the next rooms, excluding the incoming doors
                var nextRooms = [];
                for (var d = 0; d < room.doors.length; d++) {
                    var door = room.doors[d];
                    // find connected doors, but not ones that are forced incoming,
                    // not ones that are forced cross branches, and not the doors we came in on
                    if (door.otherDoor) {
                        if (door.otherDoor.outgoing) {
                            // console.log("Skipping already incoming door to " + door.otherDoor.room.toShortString());
                            continue;
                        } else if (door.crossBranch) {
                            // console.log("Skipping forced cross branch door to " + door.otherDoor.room.toShortString());
                            continue;
                        // don't go backwards
                        } else if (!doors.includes(door)) {
                            addToListIfNotPresent(nextRooms, door.otherDoor.room);
                        }
                    }
                }

                if (nextRooms.length > 0) {
                    for (var r = 0; r < nextRooms.length; r++) {
                        var nextRoom = nextRooms[r];
                        // get the connecting doors, there may be more than one
                        var nextDoors = getDoorsToRoom(room, nextRoom);
                        if (nextDoors.length == 0) {
                            console.log("oopsie");
                        }
                        currentEntry.exitDoorLists.push(nextDoors);
                    }
                }
            }
            return;
        }

        // check if we've processed all outgoing exits
        if (currentEntry.exitDoorLists.length == 0) {
            // clear the marker
            this.clearMarker(currentEntry.room);
            // pop the entry off the stack
            this.runList.shift();
            // backtrack
            return;
        }

        // get the next exit
        var exitDoors = currentEntry.exitDoorLists.shift();
        // and the next room
        var nextRoom = exitDoors[0].otherDoor.room;

        if (!this.hasMarker(nextRoom)) {
            this.runList.unshift(new TreeTraversalEntry(nextRoom, reverseDoors(exitDoors)));
            return;
        }

        // loop detected
        // console.log("loop detected at " + nextRoom.toShortString());

        // find the corresponding entry in the work stack, and fill up the loopQueue while we're at it
        currentEntry.loopQueue = [];
        var loopEntry = null;
        for (var e = 1; e < this.runList.length; e++) {
            // need to combine the entry door from one entry and the room from the previous entry
            var loopQueueEntry = [ this.runList[e].room, reverseDoors(this.runList[e-1].entryDoorList) ];
            currentEntry.loopQueue.push(loopQueueEntry);

            // found the other end of the loop
            if (this.runList[e].room == nextRoom) {
                loopEntry = this.runList[e];
                break;
            }
        }
        if (loopEntry == null) {
            console.log("UH OH");

        } else {
            // see if there's a corresponding exit door at the start of the loop that we don't need
            // to process anymore, there may not be if the other side is forced outgoing.
            var found = false;
            for (var e = 0; e < loopEntry.exitDoorLists.length; e++) {
                var loopEntryExitDoors = loopEntry.exitDoorLists[e];
                // check if the door connects to the other end of the loop
                if (loopEntryExitDoors[0].otherDoor.room == currentEntry.room) {
                    // remove it
                    loopEntry.exitDoorLists.splice(e, 1);
                    // insert an entry for this at the beginning of the loop queue
                    currentEntry.loopQueue.unshift( [currentEntry.room, reverseDoors(loopEntryExitDoors)] );
                    found = true;
                    break;
                }
            }
            if (!found) {
                // make it up
                currentEntry.loopQueue.unshift( [currentEntry.room, getDoorsToRoom(loopEntry.room, currentEntry.room)] );
            }
        }
    }
}

class BreadthFirstTreeTraversal extends AbstractTreeTraversal {
    constructor(name, root, batchSize, callback) {
        super(name, root, batchSize, callback);
    }

    traverseUnit() {
        // pop the current room off the queue
        var currentEntry = this.runList.shift();

        if (this.hasMarker(currentEntry.room)) {
            this.callback.processLoop(currentEntry.room, currentEntry.entryDoorList);
            return;
        }

        // make this easier
        var room = currentEntry.room;
        var doors = currentEntry.entryDoorList;
        // set the marker
        this.setMarker(room);

        // run the callback and see if we should traverse the room
        if (isTraversableRoom(room) && this.callback.processConnection(room, doors)) {
            // get the next rooms, excluding the incoming doors
            var nextRooms = [];
            for (var d = 0; d < room.doors.length; d++) {
                var door = room.doors[d];
                // find connected doors, but not the doors we came in on
                if (door.otherDoor) {
                     if (door.crossBranch) {
                        // console.log("Skipping forced cross branch door to " + door.otherDoor.room.toShortString());
                        continue;
                    } else if (!doors.includes(door)) {
                        addToListIfNotPresent(nextRooms, door.otherDoor.room);
                    }
                }
            }

            if (nextRooms.length > 0) {
                for (var r = 0; r < nextRooms.length; r++) {
                    var nextRoom = nextRooms[r];
                    // get the connecting doors, there may be more than one
                    var nextDoors = getDoorsToRoom(room, nextRoom);
                    if (nextDoors.length == 0) {
                        console.log("oopsie");
                    }
                    this.runList.push()
                    this.runList.push(new TreeTraversalEntry(nextRoom, reverseDoors(nextDoors)));
                }
            }
        }
    }
}