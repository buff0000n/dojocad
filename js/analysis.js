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

// helper class for storing the state of the last tree analysis
class AnalysisResult {
    constructor() {
        // whether there is a spawn point
        this.spawn = false;
        // whether there are any disconnected rooms
        this.disconnected = false;
        // whether there are any loops
        this.loops = false;
    }

    setSpawn(spawn) {
        if (!spawn && settings.structureChecking) {
            // if advanced mode is enabled then make sure there's a global warning displayed
            addAllWarning(spawnPointMissingRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(spawnPointMissingRule.globalMessage);
        }
        this.spawn = spawn;
        if (spawn) {
            // if there is a spawn point then reset the other flags so we can re-calculate them
            this.setDisconnected(false);
            this.setLoops(false);
        }
    }

    setDisconnected(disconnected) {
        if (disconnected) {
            // always make sure there's a global warning displayed
            addAllWarning(disconnectedRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(disconnectedRule.globalMessage);
        }
        this.disconnected = disconnected;
    }

    setLoops(loops) {
        if (loops && settings.structureChecking) {
            // if advanced mode is enabled then make sure there's a global warning displayed
            addAllWarning(loopedRule.globalMessage);

        } else {
            // remove the global warning if present
            removeAllWarning(loopedRule.globalMessage);
        }
        this.loops = loops;
    }
}

// static result instance, it will be updated when analysis runs
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

// callback for depth-first and breadth-first tree traversal
class AbstractTreeTraversalCallback {
    // optional: called for all rooms, do something to initialize that room
    preProcess(room) { return; /* no return value */ }
    // called for each room hit during traversal
    processConnection(room, incomingDoors) { return false; /* returns true if traversal should continue through this room */ }
    // called for each room where a loop is detected.
    // With depth-first traversal this is called for every room in a loop
    // With breadth-first traversal this is called just for the room where a loop was detected
    processLoop(room, loopingDoors) { return; /* no return value */ }
    // optional: called for all rooms, do something to finish that room
    postProcess(room) { return; /* no return value */ }
    // optional: called at the end of traversal
    end() { return; /* no return value */ }
}

// traversal process for setting up the tree structure and finding loops
class TreeStructureCallback extends AbstractTreeTraversalCallback {
    constructor() {
        super();
        // keep a running tally of disconnected rooms for the final warning update
        this.disconnectedCount = 0;
        // keep a running tally of looped rooms for the final warning update
        this.loopedCount = 0;
    }

    preProcess(room) {
        // pre-process on all rooms: clear any connected looped outgoing flags
        room.connected = false;
        room.looped = false;
        // clear door flags
        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            door.outgoing = false;
            // just initialize this to the force value
            door.crossBranch = door.forceCrossBranch;
            door.looping = false;
        }
    }

    processConnection(room, incomingDoors) {
        // room is connected
        room.connected = true;
        // set the direction on the incoming doors
        for (var d = 0; d < incomingDoors.length; d++) {
            // actually set on the other door
            incomingDoors[d].otherDoor.outgoing = true;
        }
        // continue traversal
        return true;
    }

    processLoop(room, incomingDoors) {
        // room is looped
        room.looped = true;
        // set the loop flag on the incoming door in both directions
        for (var d = 0; d < incomingDoors.length; d++) {
            incomingDoors[d].looping = true;
            incomingDoors[d].otherDoor.looping = true;
        }
    }

    postProcess(room) {
        // post-process on all rooms: check if any connected flags are not set

        // skip label objects
        if (!isTraversableRoom(room)) {
            return;
        }

        // connected check
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
            // if the room is looped, add a warning
            room.addRuleWarning(loopedRule);
            // increment the count
            this.loopedCount += 1;

        } else {
            // remove any loop warnings
            room.removeRuleWarning(loopedRule);
        }


        // set cross branch flags, if not already set
        // todo: pretty sure this isn't necessary now
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
    }
}

// traversal process for auto-setting cross branch doors
class AutoCrossBranchCallback extends AbstractTreeTraversalCallback {
    constructor() {
        super();
        // no postprocess
        this.postProcess = null;

        // list of doors auto-set
        this.autoCrossBranchDoors = [];
    }

    preProcess(room) {
        // initialize the room's doors with any force cross branch settings
        for (var d = 0; d < room.doors.length; d++) {
            var door = room.doors[d];
            door.crossBranch = door.forceCrossBranch;
        }
    }

    processConnection(room, incomingDoors) {
        // just keep traversing
        return true;
    }

    processLoop(room, incomingDoors) {
        // If we've detected a loop coming into this room, then add that door as cross branch, don't set it yet
        // todo: depending on the order of door this doesn't always get the optimally balanced tree
        for (var d = 0; d < incomingDoors.length; d++) {
            this.autoCrossBranchDoors.push(incomingDoors[d]);
        }
    }

    end() {
        // start a combination undoable operation
        startUndoCombo();
        // set all of the doors we found to cross branch
        for (var d = 0; d < this.autoCrossBranchDoors.length; d++) {
            setDoorForceCrossBranch(this.autoCrossBranchDoors[d], true, true);
        }
        // finish the undo operation, we will be able to undo this as a single operation
        endUndoCombo("Auto-fix structure");
    }
}

// traversal process for selecting rooms
class SelectBranchCallback extends AbstractTreeTraversalCallback {
    constructor(toLeaf) {
        super();
        // whether to go to the end of the branch or the root
        this.toLeaf = toLeaf;
        // no preprocess
        this.preProcess = null;
        // no postprocess
        this.postProcess = null;

        // accumulated selection
        this.selection = [];
    }

    processConnection(room, incomingDoors) {
        // if we came in on a door, and that door direction doesn't match the configured direction, then stop traversal
        if (incomingDoors && incomingDoors.length > 0 && this.toLeaf == incomingDoors[0].outgoing) {
            return false;
        }
        // add the room to the selection
        this.selection.push(room);
        // continue traversal
        return true;
    }

    processLoop(room, incomingDoors) { /* noop, this function isn't optional */ }

    end() {
        // select the accumulated rooms
        selectRooms(this.selection);
    }
}

//////////////////////////////////////////////////////////////////////////
// public utils
//////////////////////////////////////////////////////////////////////////

// util function to get all the doors leading from room 1 to room 2
// the only time this returns more than 1 door is with two 6-door halls connected with two doors.
function getDoorsToRoom(room, toRoom) {
    var nextDoors = [];
    for (var d = 0; d < room.doors.length; d++) {
        var door = room.doors[d];
        // check each door on the room to see if it connects to the toRoom
        if (door.otherDoor && door.otherDoor.room == toRoom) {
            nextDoors.push(door);
        }
    }
    return nextDoors;
}

// util function to switch each door in a list to the door on the other side
function reverseDoors(doors) {
    var otherDoors = [];
    // convert to otherDoor
    for (var d = 0; d < doors.length; d++) {
        otherDoors.push(doors[d].otherDoor);
    }
    return otherDoors;
}

// util function to filter out rooms that are not traversible.  This basically means label objects
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

// state object for tree traversal
class TreeTraversalEntry {
    constructor(room, entryDoorList) {
        this.room = room;
        this.entryDoorList = entryDoorList;

        this.exitDoorLists = null;
        this.loopQueue = null;
    }
}

// depth-first traversal implementation
class DepthFirstTreeTraversal extends AbstractTreeTraversal {
    constructor(name, root, batchSize, callback) {
        super(name, root, batchSize, callback);
    }

    traverseUnit() {
        // get the current room
        var currentEntry = this.runList[0];

        // check for a loop queue
        if (currentEntry.loopQueue) {
            // pop the next element
            var [loopRoom, loopDoors] = currentEntry.loopQueue.pop();
            // clean up the queue of it's empty
            if (currentEntry.loopQueue.length == 0) {
                currentEntry.loopQueue = null;
            }
            // just call the callback and continue
            this.callback.processLoop(loopRoom, loopDoors);
            return;
        }

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

                //get the list of next rooms to traverse
                if (nextRooms.length > 0) {
                    for (var r = 0; r < nextRooms.length; r++) {
                        var nextRoom = nextRooms[r];
                        // get the connecting doors, there may be more than one
                        var nextDoors = getDoorsToRoom(room, nextRoom);
                        // push onto the nextDoor queue
                        currentEntry.exitDoorLists.push(nextDoors);
                    }
                }
            }
            // unit done
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
        // unit done
    }
}

// breadth-first traversal implementation
class BreadthFirstTreeTraversal extends AbstractTreeTraversal {
    constructor(name, root, batchSize, callback) {
        super(name, root, batchSize, callback);
    }

    traverseUnit() {
        // pop the current room off the queue
        var currentEntry = this.runList.shift();

        // already visited this room, looop detected
        if (this.hasMarker(currentEntry.room)) {
            // call the calback and continue
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
                    // push to the end of the work queue
                    this.runList.push(new TreeTraversalEntry(nextRoom, reverseDoors(nextDoors)));
                }
            }
        }
    }
}