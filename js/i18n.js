var i18n = (function() {
    // supported language list
    var languageList = [
        { key: "en", name: "English" },
        { key: "fr", name: "Français mal traduit" },
        { key: "it", name: "Italiano mal tradotto" },
        { key: "de", name: "Schlecht übersetztes Deutsch" },
        { key: "es", name: "Español mal traducido" },
        { key: "pt", name: "Português mal traduzido" },
        { key: "ru", name: "Плохо переведен на Русский" },
        { key: "pl", name: "Słabo przetłumaczony na Polski" },
        { key: "ua", name: "Погано перекладена Yкраїнська" },
        { key: "tr", name: "Kötü çevrilmiş Türkçe" },
        { key: "ja", name: "下手に翻訳された日本語" },
        { key: "zh-CN", name: "简体中文翻译不好" },
        { key: "zh-TW", name: "繁體中文翻譯不佳" },
        { key: "ko", name: "잘못 번역된 한국어" },
        { key: "pg", name: "Igpay Atinlay" }
    ];

    // default language, all missing i18n keys will fallback to this
    var defaultLanguage = "en";
    // bundle for the default language, this is always loaded
    var defaultBundle = null;
    // current language
    var currentLanguage = null;
    // current language bundle
    var bundle = null;

    function init(callback = null) {
        // load the default bundle
        loadBundle(defaultLanguage, (json) => {
            defaultBundle = json;
            // now load the current language bundle
            // todo: do these concurrently?
            refreshLanguage(callback);
        });
    }

    // why are there so many possibilites for this
    function getLanguage() {
        return navigator.userLanguage
            || (navigator.languages && navigator.languages.length && navigator.languages[0])
            || navigator.language
            || navigator.browserLanguage
            || navigator.systemLanguage
            || defaultLanguage;
    }

    function findLanguage(prefix) {
        var entry = prefix ? languageList.find((e) => e.key.startsWith(prefix)) : null;
        return entry ? entry.key : null;
    }

    function refreshLanguage(callback = null) {
        // read current language from settings first
        var newLanguage = settings.language;
        currentLanguage = findLanguage(newLanguage);

        // try the browser second
        if (!currentLanguage) {
            newLanguage = getLanguage();
            if (newLanguage) {
                // just to be safe, make sure it's using a standard ISO-639-1 '-' instead of a '_'.
                newLanguage = newLanguage.replaceAll("_", "-");
                currentLanguage = findLanguage(newLanguage);
            }
        }

        if (!currentLanguage) {
            // try without the country qualifier
            newLanguage = newLanguage.substring(0, newLanguage.indexOf("-"));
            currentLanguage = findLanguage(newLanguage);
        }

        if (!currentLanguage) {
            // fall back the default language
            currentLanguage = defaultLanguage;
        }

        // check if the current language is the default
        if (currentLanguage == defaultLanguage) {
            // don't need to load anything else
            bundle = defaultBundle;
            // initialize the UI and callback
            initUIStrings();
            if (callback) callback();

        } else {
            // clear out the current bundle
            bundle = null;
            // load the new one
            loadBundle(currentLanguage, (json) => {
                bundle = json;
                // initialize the UI and callback
                initUIStrings();
                if (callback) callback();
            });
        }
    }

    function getBundleFile(language) {
        // path to bundle file
        return "js/i18n/" + language + ".js";
    }

    // load a bundle in the background, parse to JSON, and call a callback
    function loadBundle(language, callback) {
        var file = getBundleFile(language);
        Loader.load(file, (text) => {
            var json = JSON.parse(text);
            callback(json);
        });
    }

    // this could have been an email
    function getLanguageList() {
        return languageList;
    }

    // convenience to set an image alt-text somewhere under the given element
    function setTitle(node, title) {
        // check if it's an image element
        if (node.title) {
            // set the title
            node.title = title;
            // we're done
            return true;
        } else {
            // recursively search children for an image element
            for (var i = 0; i < node.children.length; i++) {
                // return early if it found an image
                if (setTitle(node.children[i], title)) return;
            }
        }
    }

    function initUIStrings() {
        // find all static document elements with ids that start with "i18n...".
        var list = document.querySelectorAll('*[id^=i18n]')
        // loop over them
        for (var i = 0; i < list.length; i++) {
            // get the element by id
            var element = list[i];
            var id = element.id;
            // strip the first dot-delimited item from the id to get the i18n key
            // there can be extra characters between "i18n" and the first dot, this is to allow multiple
            // elements to share the same i18n key while still havng unique ids.
            var key = id.substring(id.indexOf(".") + 1);

            // what we do depends on the element type
            switch (element.nodeName) {
                case "IMG":
                    // replace the alt text on images
                    element.title = i18n.str(key); break;
                case "INPUT":
                    // replace the value on inputs
                    element.value = i18n.str(key); break;
                default:
                    // otherwise, replace the inner text
                    element.innerHTML = i18n.str(key);
            }
        }

        // short circuit if we're still in the process of initializing the page
        if (modelInitialized) {
            // okay, to make things much easier we're just going to reload the whole model.
            // Start by going to floor 0.  Otherwise, if we're currently viewing a basement
            // floor then it's not going to fully clear out all the floor names we might
            // need to refresh
            doSetFloor(0);
            // reload the model from the current URL
            reLoadModelFromUrl(getHref());
        }
    }

    // main entry point: get the I18N string for a given key and perform any substitutions
    function str(key, ...subs) {
        // short-circuit if the bundles are still loading
        if (!bundle) {
            return "Loading...";
        }

        // look up the key in the current language bundle
        var string = bundle[key];
        // fall back to the default bundle if not found
        if (!string) {
            string = defaultBundle[key];
        }
        // sanity check
        if (!string) {
            console.log("Unknown i18n key: " + key);
            return key;
        }
        // if there are no substitutions, return the string
        if (subs.length == 0) {
            return string;
        }
        // otherwise, perform the substitutions
        return sub(string, subs);
    }

    // parse a string of the form "...{0}...{2}...{1}...etc" and insert substutions referenced by index
    function sub(string, subs) {
        // result string
        var result = "";
        // string index
        var index = 0;

        // loop
        while (index < string.length) {
            // get the next substitution
            var index2 = string.indexOf("{", index);
            // no more substitutions
            if (index2 < 0) {
                break;
            }
            // append the string fragment up to the substitution to the result
            result += string.substring(index, index2);

            // if the curly bracket is escaped, like "\{", then ignore it
            if (string.charAt(index2 - 1) == '\\') {
                // add the curly bracket directly to the result
                result += string.charAt(index2);
                // continue loop
                index = index2 + 1;
                continue;
            }

            // get the end of the substitution reference
            index = string.indexOf("}", index2);
            // sanity check
            if (index < 0) {
                throw "Malformed I18N string: '" + string + "'";
            }

            // pull out the middle of the substition reference and parse as an integer
            var subNumString = string.substring(index2 + 1, index);
            var subNum = parseInt(subNumString);

            // sanity check on number format
            if (isNaN(subNum)) {
                throw "Malformed I18N substitution: '" + subNum + "'";
            }

            // sanity check on there being a substitution with that index
            if (subNum >= subs.length) {
                throw "I18N string needs " + (subNum + 1) + " substitutions, only " + subs.length + " provided";
            }

            // append the indicated substitution from the array
            result += subs[subNum];
            // continue
            index += 1;
        }

        // if index is past the end of the string then substring() returns an empty string.
        result += string.substring(index);
        // done, that was easy
        return result;
    }

    function getHelpUrl() {
        // for convenience, the help file name comes from the bundle
        return str("help.file");
    }

    // test support: generate a pig-latin version of the english bundle
    // I put way too much effort into this, but it's so worth it
    function genPig() {
        var vowels = "aeiou";

        function isLowerCase(letter) {
            return letter >= 'a' && letter <= 'z';
        }

        function pigWord(word) {
            if (word.length == 0) return word;
            if (!isLowerCase(word[0].toLowerCase())) return word;

            var vowelIndex = 0;
            while (vowelIndex < word.length && vowels.indexOf(word[vowelIndex].toLowerCase()) < 0) vowelIndex++;

            // no vowels
            if (vowelIndex == word.length) {
                return word + (isLowerCase(word[word.length - 1]) ? "way" : "WAY");
            }

            // starts with a vowel
            if (vowelIndex == 0) {
                return word + (isLowerCase(word[word.length - 1]) ? "way" : "WAY");
            }

            // starts with one or more consonants, followed by a vowel
            var consonants = word.substring(0, vowelIndex);
            var rest = word.substring(vowelIndex);

            if (!isLowerCase(consonants[0]) && isLowerCase(rest[0])) {
                consonants = consonants[0].toLowerCase() + consonants.substring(1);
                rest = rest[0].toUpperCase() + rest.substring(1);
            }

            return rest + consonants + (isLowerCase(consonants[consonants.length - 1]) ? "ay": "AY");
        }

        function pigString(string) {
            var list = string.match(/([a-z]+|[^a-z]+)/ig)
            for (var i = 0; i < list.length; i++) {
                list[i] = pigWord(list[i]);
            }
            return list.join("");
        }

        var newBundle = {};
        for (var key in defaultBundle) {
            if (key == "help.file") continue;
            newBundle[key] = pigString(defaultBundle[key]);
        }
        console.log(JSON.stringify(newBundle));
    }

    function checkBundles() {
        function runCheck(entry) {
            loadBundle(entry.key, (json) => {
                var result = "------------------------------------------------------------------------------\nBundle: " + entry.key;
                for (var k in json) {
                    if (!defaultBundle[k]) {
                        result += "\n" + k;
                    }
                }
                console.log(result);
            });
        }
        for (var i = 0; i < languageList.length; i++) {
            runCheck(languageList[i]);
        }
    }

    function exportAsCsv() {
        var csv = "Key,Text\n";
        for (var key in bundle) {
            csv += key + "," + bundle[key] + "\n";
        }
        console.log(csv);
    }

    function getBundleLink(language=null) {
        return "https://raw.githubusercontent.com/buff0000n/dojocad/master/" + getBundleFile(language ? language : currentLanguage);
    }

    return {
        init: init, // (callback)
        str: str, // (key, ...subs)
        getHelpUrl: getHelpUrl, // ()
        refreshLanguage: refreshLanguage, // ()
        getLanguageList: getLanguageList, // (): { {"key", "description",
        getBundleLink: getBundleLink, // (language = null)
        genPig: genPig, // ()
        checkBundles: checkBundles, // ()
        exportAsCsv: exportAsCsv, // ()
    }

})();
