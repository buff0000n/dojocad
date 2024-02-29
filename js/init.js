
    /************************************************************
     * Dynamic panels
     ************************************************************/

    function toggleHelp() {
        var help = document.getElementById("help");
        var helpToggle = document.getElementById("helpToggle");

        if (help.style.visibility == "visible") {
            help.style.visibility = "hidden";
            help.innerHTML = ``;
            helpToggle.innerHTML = `<img id="i18n.main.page.alttext.helpToggle" src="icons/icon-help.png" srcset="icons2x/icon-help.png 2x" title="${i18n.str("main.page.alttext.helpToggle")}"/>`;

        } else {
            var helpUrl = i18n.getHelpUrl();
            help.innerHTML = `<embed id="helpEmbed" src="${helpUrl}"/>`;
            help.style.visibility = "visible";
            helpToggle.innerHTML = `<img id="i18n.main.page.alttext.helpToggle.close" src="icons/icon-close.png" srcset="icons2x/icon-close.png 2x" title="${i18n.str("main.page.alttext.helpToggle.close")}"/>`;
        }
    }

    function toggleFooter() {
        if (window.event && window.event.altKey) {
            // Shhh super secret debug mode don't tell anyone okay
            toggleDebug();
            return;
        }
    }

    function toggleDebug() {
        if (debugEnabled) {
            debugEnabled = false;
            setModelDebug(false);
            showDebug(i18n.str("misc.debug.off"));
            hideDebug();
            removeUrlQueryParam("debug");
			saveModelToUrl();

        } else {
            debugEnabled = true;
            setModelDebug(true);
            showDebug(i18n.str("misc.debug.on"));
            modifyUrlQueryParam("debug", "true");
			saveModelToUrl();
        }

        enableAutoScrollDebug(debugEnabled);
        enableOriginDebug(debugEnabled);
    }

    /************************************************************
     * Error and debug bars
     ************************************************************/

    function windowOnError(msg, url, lineNo, columnNo, error) {
        var html = url + ": " + lineNo + ":" + columnNo + "<br/>";
        var html = html + msg.replace("Uncaught ", "");
        showError(html);
        return false;
    }

    function showError(html) {
        clearMenus();
        var errorBarElement = document.getElementById("errorBar");
        errorBarElement.innerHTML = html;
        errorBarElement.style.visibility = "visible";

        return false;
    }

    function clearErrors() {
        // find the error bar and clear it out
        var errorBarElement = document.getElementById("errorBar");
        if (errorBarElement.style.visibility != "hidden") {
            errorBarElement.innerHTML = "";
            errorBarElement.style.visibility = "hidden";
        }
    }

    var debugCount = 0;
    var maxDebugLines = 5;

    function showDebug(html) {
        var debugBarElement = document.getElementById("debugBar");

        while (debugBarElement.childElementCount >= maxDebugLines) {
            debugBarElement.firstElementChild.remove();
        }
        var div = document.createElement("div");
        debugCount++;
        div.innerHTML = debugCount + ". " + html;
        debugBarElement.appendChild(div);

        debugBarElement.style.visibility = "visible";
    }

    function hideDebug() {
        var debugBarElement = document.getElementById("debugBar");

        debugBarElement.style.visibility = "hidden";
    }

    /************************************************************
     * init
     ************************************************************/

    function init() {
        /*
        var vh = window.innerHeight - 34;
        var declaration = document.styleSheets[0].cssRules[0].style;
        declaration.setProperty("--vh100", vh + "px");
        */

        // set up the error listener
        window.onerror = windowOnError;

        onresize();

        // initialize language
        i18n.init(() => {
            // init the model and debug after i18n has been initialized
            if (getQueryParam(window.location.href, "debug") == "true") {
                toggleDebug();
            }

            if (getQueryParam(window.location.href, "preset")) {
                var presetUrl = Presets[getQueryParam(window.location.href, "preset")];
                if (presetUrl) {
                    updateHref(presetUrl);
                }
            }

            initModel();

        });

        // we have to do this with addEventListener() instead of directly on the <div> so we can tell stupid Chrome that
        // none of these event handlers are passive
        var grid = document.getElementById("grid");
        grid.addEventListener("mousedown", mouseDown, { passive: false });
        grid.addEventListener("wheel", wheel, { passive: false });
        grid.addEventListener("touchstart", touchStart, { passive: false });
        grid.addEventListener("touchcancel", touchCancel, { passive: false });

        // javascript is working
        clearErrors();

    }

    function onresize() {
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight);
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth);
        windowSizeChanged(h, w);

    	if (w < 425) {
    	    ensureDoubleRowStats();
    	} else {
    	    ensureSingleRowStats();
        }
    }

    function ensureDoubleRowStats() {
        ensureRowStats("statsBarLine1", "statsBarLine2");
    }

    function ensureSingleRowStats() {
        ensureRowStats("statsBarInline", "statsBarInline");
    }

    function ensureRowStats(class1, class2) {
        var line1 = document.getElementById("statsBarLine1");
        if (line1.className != class1) {
            line1.className = class1;
        }
        var line2 = document.getElementById("statsBarLine2");
        if (line2.className != class2) {
            line2.className = class2;
        }
    }

    function onScroll() {
        // huge freaking hack for Chrome:
        // when you click on a link inside the Help section Chrome scrolls the page, on both mobile and desktop versions.
        // I tried very hard to find a "correct" way to fix this, but nothing worked.
        // This also appears to fix a few auto-scroll issues when switching floors to a floor with rooms off the bottom
        // of the screen in ther browser.

        // So here we are, listening for scroll events and negating them manually.  We're fine, we're all fine here.  How are you?
        document.body.scrollTo(0, 0);
    }
