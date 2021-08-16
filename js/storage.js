class Storage {
    constructor() {
        this.keyPrefix = "dojocad:save:";
    }

    // returns [{name, timestamp, date}]
    getListing() {
        var listing = [];
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            if (key.startsWith(this.keyPrefix)) {
                var entry = JSON.parse(localStorage.getItem(key));
                listing.push({
                    "name": key.substring(this.keyPrefix.length),
                    "item": entry.item,
                    "timestamp": entry.timestamp,
                    "date": new Date(entry.timestamp).toLocaleString()
                });
            }
        }
        return listing;
    }

    addItem(name, item) {
        var key = this.keyPrefix + name;
        var entry = {
            "timestamp": new Date().getTime(),
            "item": item
        }
        var exists = window.localStorage.getItem(key) != null;
        window.localStorage.setItem(key, JSON.stringify(entry));
        return exists;
    }

    removeItem(name, item) {
        var key = this.keyPrefix + name;
        var exists = window.localStorage.getItem(key) != null;
        if (exists) {
            window.localStorage.removeItem(key);
        }
        return exists;
    }

    containsItem(name) {
        var key = this.keyPrefix + name;
        return window.localStorage.getItem(key) != null;
    }
}

var storage = new Storage();