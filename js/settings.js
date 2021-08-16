class Settings {
    constructor() {
        this.key = "dojocad:settings";

        this.showAllFloors = true;
        this.showMapMarkers = true;
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
        }
    }

    save() {
        var props = {
            "showAllFloors": this.showAllFloors,
            "showMapMarkers": this.showMapMarkers
        }
        window.localStorage.setItem(this.key, JSON.stringify(props));
    }
}

var settings = new Settings();
