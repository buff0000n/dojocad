class Storage {
    constructor() {
        this.keyPrefix = "dojocad:save:";
        this.autosaveName = "Autosave";
        this.autosaveDelay = 2000;
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

        if (this.isSortByDate()) {
            listing.sort((a, b) => {
                return (a.timestamp - b.timestamp) * (this.isSortAscending() ? 1 : -1);
            });

        } else {
            listing.sort((a, b) => {
                return a.name.localeCompare(b.name) * (this.isSortAscending() ? 1 : -1);
            });
        }

        return listing;
    }

    isSortByDate() {
        return settings.localStoreSort == "date";
    }

    isSortByName() {
        return !this.isSortByDate();
    }

    isSortAscending() {
        return settings.localStoreSortAsc;
    }

    setSortByName() {
        settings.localStoreSort = "name";
        settings.save();
    }

    setSortByDate() {
        settings.localStoreSort = "date";
        settings.save();
    }

    setSortAscending(asc) {
        settings.localStoreSortAsc = asc;
        settings.save();
    }

    getItem(name) {
        var key = this.keyPrefix + name;
        var entry = window.localStorage.getItem(key);
        if (entry) {
            var json = JSON.parse(entry);
            return json.item;
        }
        return null;
    }

    getAutosaveItem() {
        return this.getItem(this.autosaveName);
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

    autosaveItem(item) {
        if (this.autosaveTimeout) {
    		clearTimeout(this.autosaveTimeout);
        }

    	this.autosaveTimeout = setTimeout(() => {
            this.addItem(this.autosaveName, item);
    	}, this.autosaveDelay);
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

    containsAutosaveItem() {
        return this.containsItem(this.autosaveName);
    }
}

var storage = new Storage();