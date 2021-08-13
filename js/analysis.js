// if it's worth engineering it's worth overengineering -B

// don't need much of a delay, if someone's sitting on the undo button we'll just end up canceling a bunch of runs
var treeUpdateDelay = 50;
var treeUpdateTimeout = null;

function treeUpdated() {
	if (treeUpdateTimeout) {
		clearTimeout(treeUpdateTimeout);
	}

	treeUpdateTimeout = setTimeout(actuallyUpdateTree, treeUpdateDelay);
}

class DisconnectedRule {
    toString() { return "Disconnected room"; }
}

var disconnectedRule = new DisconnectedRule();

function actuallyUpdateTree() {

    var root = getCurrentSpawnRoom();
    if (!root) {
        return;
    }

    disconnectedCount = 0;

    startTreeTraversal("connected", root, 25,
        (room) => {
            room.connected = false;
        },
        (room) => {
		    if (room.metadata.num == 0) {
		        return false;
		    }
            room.connected = true;
            return true;
        },
        (room) => {
            if (room.connected) {
                room.removeRuleWarning(disconnectedRule);
                // remove warning

            } else if (room.metadata.num != 0) {
                room.addRuleWarning(disconnectedRule);
                disconnectedCount += 1;
            }
        },
        () => {
            if (disconnectedCount > 0) {
				addAllWarning("Disconnected rooms");

            } else {
				removeAllWarning("Disconnected rooms");
            }
        }
    );
}

var treeTraversals = {};

function startTreeTraversal(name, root, batchSize, startFun, nodeFun, postFun, endFun) {
    cancelTreeTraversal(name);

    var tt = new TreeTraversal(name, root, batchSize, startFun, nodeFun, postFun, endFun);
    treeTraversals[name] = tt;
    tt.start();
}

function cancelTreeTraversal(name) {
    if (treeTraversals[name]) {
		treeTraversals[name].cancel();
		treeTraversals[name] = null;
    }
}

class TreeTraversal {
    constructor(name, root, batchSize, preFun, nodeFun, postFun, endFun) {
        this.name = name;
        this.batchSize = batchSize;
        this.root = root;
        this.preFun = preFun;
        this.nodeFun = nodeFun;
        this.postFun = postFun;
        this.endFun = endFun;
        this.timeout = null;

        // state
        this.runList = null;
        this.traversalStack = null;
    }

    schedule(fun) {
        this.timeout = setTimeout(fun, 1);
    }

    cancel() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (treeTraversals[this.name] == this) {
            treeTraversals[this.name] == null;
        }
    }

    start() {
	    this.schedule(() => { this.runPre(); });
    }

    checkStillRunning() {
        this.timeout = null;
        return treeTraversals[this.name] == this;
    }

    runPre() {
        if (!this.checkStillRunning()) {
            return;
        }

        if (this.preFun) {
            if (!this.runList) {
                this.runList = roomList.slice();
            }

            var count = 0;
            while (this.runList.length > 0 && count < this.batchSize) {
                count += 1;
                this.preFun(this.runList.shift());
            }

            if (this.runList.length > 0) {
                this.schedule(() => { this.runPre(); });
                return;
            }
        }

        this.runList = null;
        this.schedule(() => { this.runTraversal(); });
    }

    hasVisited(room) {
        return room.traversalMarker && room.traversalMarker.includes(this);
    }

    markVisited(room) {
        if (!room.traversalMarker) {
            room.traversalMarker = [];
        }
        if (!room.traversalMarker.includes(this)) {
            room.traversalMarker.push(this);
            return true;
        }
        return false;
    }

    clearVisited(room) {
        if (room.traversalMarker && removeFromList(room.traversalMarker, this) && room.traversalMarker.length == 0) {
            room.traversalMarker = null;
        }
    }

    runTraversal() {
        if (!this.checkStillRunning()) {
            return;
        }

        if (!this.runList) {
            this.runList = [this.root];
        }

        var count = 0;
        while (this.runList.length > 0 && count < this.batchSize) {
            count += 1;
            var room = this.runList.shift();
            this.markVisited(room);

            if (this.nodeFun(room)) {
                var moreRooms = room.getConnectedRooms();
                for (var r = 0; r < moreRooms.length; r++) {
                    var otherRoom = moreRooms[r];
                    if (!this.hasVisited(otherRoom)) {
                        this.runList.push(otherRoom);
                    }
                }
            }

        }

        if (this.runList.length > 0) {
    	    this.schedule(() => { this.runTraversal(); });

        } else {
            this.runList = null;
            this.schedule(() => { this.runPost(); });
        }
    }

    runPost() {
        if (!this.checkStillRunning()) {
            return;
        }

        if (!this.runList) {
            this.runList = roomList.slice();
        }

        var count = 0;
        while (this.runList.length > 0 && count < this.batchSize) {
            var room = this.runList.shift();
            if (this.postFun) {
                count += 1;
                this.postFun(room);
            }
            this.clearVisited(room);
        }

        if (this.runList.length > 0) {
            this.schedule(() => { this.runPost(); });
            return;
        }

        this.runList = null;
        this.schedule(() => { this.runEnd(); });
    }

    runEnd() {
        if (!this.checkStillRunning()) {
            return;
        }

        if (this.endFun) {
            this.endFun();
        }

        this.cancel();
    }
}
