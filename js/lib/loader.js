var Loader = (function() {

    function load(path, callback) {
        // build a new AJAX request
        var request = new XMLHttpRequest();

        // event listeners
//        request.addEventListener("progress", (event) => updateProgress(event, callback));
        request.addEventListener("load", (event) => transferComplete(event, callback));
        request.addEventListener("error", (event) => transferFailed(event, callback));
        request.addEventListener("abort", (event) => transferCanceled(event, callback));

        // set up the AJAX request
        request.open("GET", path);
        // run the request, this runs in the background and call the event listeners
        request.send();
    }

//    function updateProgress(event, callback) {
//        // show progress, if applicable
//        if (event.lengthComputable) {
//            // compute the completion amount
//            var completeAmount = event.loaded / event.total;
//            // update the UI
//            this.setProgress(completeAmount);
//        }
//    }

    function transferComplete(event, callback) {
        // get the loaded data
        var response = event.currentTarget.responseText;
        // run the callback
        callback(response);
    }

    function transferFailed(event, callback) {
        console.log("Transfer failed");
    }

    function transferCanceled(event, callback) {
        console.log("Transfer canceled");
    }

    return {
        load: load, // (url, callback)
    }

})();