// Wrapper class for persistent settings

class Settings {
    constructor() {
        // local storage key
        this.key = "dojocad:settings";

        // default setting values
        this.showAllFloors = true;
        this.showMapMarkers = true;
        this.showLabels = true;
        this.dimRooms = false;
        this.autosave = false;
        this.structureChecking = false;
        this.localStoreSort = "name";
        this.localStoreSortAsc = true;
        this.rulesEnabled = true;

        // load from local storage
        this.load();
    }

    load() {
        // load the local storage item
        var json = window.localStorage.getItem(this.key);
        if (json) {
            // parse json
            var props = JSON.parse(json);

            // check for each setting and override the default if present
            if (props.showAllFloors != null) {
                this.showAllFloors = props.showAllFloors;
            }
            if (props.showMapMarkers != null) {
                this.showMapMarkers = props.showMapMarkers;
            }
            if (props.showLabels != null) {
                this.showLabels = props.showLabels;
            }
            if (props.dimRooms != null) {
                this.dimRooms = props.dimRooms;
            }
            if (props.autosave != null) {
                this.autosave = props.autosave;
            }
            if (props.structureChecking != null) {
                this.structureChecking = props.structureChecking;
            }
            if (props.localStoreSort != null) {
                this.localStoreSort = props.localStoreSort;
            }
            if (props.localStoreSortAsc != null) {
                this.localStoreSortAsc = props.localStoreSortAsc;
            }
            if (props.rulesEnabled != null) {
                this.rulesEnabled = props.rulesEnabled;
            }
        }
    }

    save() {
        // build something we can JSONify
        var props = {
            "showAllFloors": this.showAllFloors,
            "showMapMarkers": this.showMapMarkers,
            "showLabels": this.showLabels,
            "dimRooms": this.dimRooms,
            "autosave": this.autosave,
            "structureChecking": this.structureChecking,
            "localStoreSort": this.localStoreSort,
            "localStoreSortAsc": this.localStoreSortAsc,
            "rulesEnabled": this.rulesEnabled
        }
        // format as JSON and save to local storage
        window.localStorage.setItem(this.key, JSON.stringify(props));
    }
}

var settings = new Settings();
