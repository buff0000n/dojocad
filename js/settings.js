// Wrapper class for persistent settings

class Settings {
    constructor() {
        // local storage key
        this.key = "dojocad:settings";

        // default setting values
        this.showAllFloors = true;
        this.showMapMarkers = true;
        this.showLabels = true;
        this.autosave = false;
        this.localStoreSort = "name";
        this.localStoreSortAsc = true;

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
            if (props.autosave != null) {
                this.autosave = props.autosave;
            }
            if (props.localStoreSort != null) {
                this.localStoreSort = props.localStoreSort;
            }
            if (props.localStoreSortAsc != null) {
                this.localStoreSortAsc = props.localStoreSortAsc;
            }
        }
    }

    save() {
        // build something we can JSONify
        var props = {
            "showAllFloors": this.showAllFloors,
            "showMapMarkers": this.showMapMarkers,
            "showLabels": this.showLabels,
            "autosave": this.autosave,
            "localStoreSort": this.localStoreSort,
            "localStoreSortAsc": this.localStoreSortAsc
        }
        // format as JSON and save to local storage
        window.localStorage.setItem(this.key, JSON.stringify(props));
    }
}

var settings = new Settings();
