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
            }
            removeAllWarning("Disconnected rooms");
        }
        return;
    }
	ranATreeUpdate = true;

    // keep a running tally of disconnected rooms for the final warning update
    disconnectedCount = 0;

    // start a tree traversal
    startTreeTraversal("connected", root, 25,
        (room) => {
            // pre-process on all rooms: clear any connected flags
            room.connected = false;
        },
        (room) => {
            // traversal process: set the connected flag
            // skip rooms that don't count, like the label object
		    if (room.metadata.num == 0) {
		        // don't continue traversal through this room
		        return false;
		    }
		    // set the flag
            room.connected = true;
            // continue traversal through this room
            return true;
        },
        (room) => {
            // post-process on all rooms: check if any connected flags are not set
            if (room.connected) {
                // if the room is connected, remove any warnings
                room.removeRuleWarning(disconnectedRule);

            } else if (room.metadata.num != 0) {
                // if the room is not connected, add a warning
                room.addRuleWarning(disconnectedRule);
                // increment the count
                disconnectedCount += 1;
            }
        },
        () => {
            // check the count
            if (disconnectedCount > 0) {
                // make sure there's a global warning displayed
				addAllWarning("Disconnected rooms");

            } else {
                // remove the global warning if present
				removeAllWarning("Disconnected rooms");
            }
        }
    );
}

//////////////////////////////////////////////////////////////////////////
// relatively generic tree traversal function
//////////////////////////////////////////////////////////////////////////

// track running traversals
var treeTraversals = {};

function startTreeTraversal(name, root, batchSize, startFun, nodeFun, postFun, endFun) {
    // cancel any existing tree traversal with the same name
    cancelTreeTraversal(name);

    // create a new traversal
    var tt = new TreeTraversal(name, root, batchSize, startFun, nodeFun, postFun, endFun);
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
class TreeTraversal {
    constructor(name, root, batchSize, preFun, nodeFun, postFun, endFun) {
        // tracking name
        this.name = name;
        // maximum number of callbacks to run for each timer batch
        this.batchSize = batchSize;
        // start point
        this.root = root;
        // callback for pre-processing all rooms, (room) => void
        this.preFun = preFun;
        // call back for processing each traversed room (room) => boolean (true to continue traversing through the room
        this.nodeFun = nodeFun;
        // callback for post-processing all rooms, (room) => void
        this.postFun = postFun;
        // callback for the end of the traversal, () => void
        this.endFun = endFun;

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
        if (this.preFun) {
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
                this.preFun(this.runList.shift());
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

    hasVisited(room) {
        // check if the room has been visited by this traversal
        return room.traversalMarker && room.traversalMarker.includes(this);
    }

    markVisited(room) {
        // mark the room as having been visited by this traversal
        if (!room.traversalMarker) {
            room.traversalMarker = [];
        }
        if (!room.traversalMarker.includes(this)) {
            room.traversalMarker.push(this);
            // has not been visited yet, so visit this room
            return true;
        }
        // has already been visited, do not visit again
        return false;
    }

    clearVisited(room) {
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

        // initialize the work queue with the root room
        if (!this.runList) {
            this.runList = [this.root];
        }

        // run callbacks until there are no more rooms to visit or we hit the batch size
        while (this.runList.length > 0 && this.count < this.batchSize) {
            // increment the batch count
            this.count += 1;
            // pull the next room off the queue
            var room = this.runList.shift();
            // mark the room, we're assuming we haven't visited it yet
            this.markVisited(room);

            // run the call back and see if we should continue traversing through this room
            if (this.nodeFun(room)) {
                // get connected rooms
                var moreRooms = room.getConnectedRooms();
                for (var r = 0; r < moreRooms.length; r++) {
                    var otherRoom = moreRooms[r];
                    // if the room has not been visited yet then add it to the end of the queue
                    if (!this.hasVisited(otherRoom)) {
                        // this is a breadth-first traversal, for a depth-first traversal we would put the room at
                        // the beginning of the queue
                        this.runList.push(otherRoom);
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
            if (this.postFun) {
                // increment count
                this.count += 1;
                // run the pre-processing callback on it
                this.postFun(room);
            }
            // clear the visited flag, do this regardless of whether there's a post-processing function specified
            this.clearVisited(room);
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
        if (this.endFun) {
            this.endFun();
        }

        // clean up
        this.cancel();
    }
}
