class Settings {
    constructor() {
        this.key = "dojocad:settings";

        this.showAllFloors = true;
        this.showMapMarkers = true;
        this.autosave = false;
        this.localStoreSort = "name";
        this.localStoreSortAsc = true;

        this.load();
    }

    load() {
        var json = window.localStorage.getItem(this.key);
        if (json) {
            var props = JSON.parse(json);
            if (props.showAllFloors != null) {
                this.showAllFloors = props.showAllFloors;
            }
            if (props.showMapMarkers != null) {
                this.showMapMarkers = props.showMapMarkers;
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
        var props = {
            "showAllFloors": this.showAllFloors,
            "showMapMarkers": this.showMapMarkers,
            "autosave": this.autosave,
            "localStoreSort": this.localStoreSort,
            "localStoreSortAsc": this.localStoreSortAsc
        }
        window.localStorage.setItem(this.key, JSON.stringify(props));
    }
}

var settings = new Settings();
