var i18n = (function() {
    var languageList = [
        { key: "en-US", name: "English" },
        { key: "pl-US", name: "Igpay Atinlay" }
    ];

    var languageSet = {};
    for (var i = 0; i < languageList.length; i++) {
        var entry = languageList[i];
        languageSet[entry.key] = entry.key;
    }

    var defaultLanguage = "en-US";
    var defaultBundle = null;
    var currentLanguage = null;
    var bundle = null;

    function init(callback = null) {
        loadBundle(defaultLanguage, (json) => {
            defaultBundle = json;
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

    function refreshLanguage(callback = null) {
        currentLanguage = settings.language;
        if (!currentLanguage) {
            currentLanguage = getLanguage();
        }

        if (!languageSet[currentLanguage]) {
            currentLanguage = defaultLanguage;
        }

        if (currentLanguage == defaultLanguage) {
            bundle = defaultBundle;
            initUIStrings();
            if (callback) callback();

        } else {
            bundle = null;
            loadBundle(currentLanguage, (json) => {
                bundle = json;
                initUIStrings();
                if (callback) callback();
            });
        }
    }

    function loadBundle(locale, callback) {
        var file = "js/i18n/" + locale + ".js";
        Loader.load(file, (text) => {
            var json = JSON.parse(text);
            callback(json);
        });
    }

    function getLanguageList() {
        return languageList;
    }

    function setTitle(node, title) {
        if (node.title) {
            node.title = title;
            // console.log("set on " + node + ": " + title);
            return true;
        } else {
            for (var i = 0; i < node.children.length; i++) {
                if (setTitle(node.children[i], title)) return;
            }
        }
    }

    function initUIStrings() {
        for (var key in mainPageImageAltText) {
            var alttext = str(mainPageImageAltText[key]);
            var container = document.getElementById(key);
            setTitle(container, alttext);
        }
        // uh
        if (modelInitialized) {
            doSetFloor(0);
            reLoadModelFromUrl(getHref());
        }
    }

    function str(name, ...subs) {
        if (!bundle) {
            return "Loading...";
        }

        var string = bundle[name];
        if (!string) {
            string = defaultBundle[name];
        }
        if (!string) {
            console.log("Unknown i18n key: " + name);
            return name;
        }
        if (subs.length == 0) {
            return string;
        }
        return sub(string, subs);
    }

    function sub(string, subs) {
        var result = "";
        var index = 0;

        while (index < string.length) {
            var index2 = string.indexOf("{", index);
            if (index2 < 0) {
                break;
            }
            result += string.substring(index, index2);

            if (string.charAt(index2 - 1) == '\\') {
                result += string.charAt(index2);
                index = index2 + 1;
                continue;
            }

            index = string.indexOf("}", index2);
            if (index < 0) {
                throw "Malformed I18N string: '" + string + "'";
            }

            var subNumString = string.substring(index2 + 1, index);
            var subNum = parseInt(subNumString);

            if (isNaN(subNum)) {
                throw "Malformed I18N substitution: '" + subNum + "'";
            }

            if (subNum >= subs.length) {
                throw "I18N string needs " + (subNum + 1) + " substitutions, only " + subs.length + " provided";
            }

            result += subs[subNum];
            index += 1;
        }

        // if index is past the end of the string then substring() returns an empty string.
        result += string.substring(index);
        return result;
    }

    function getHelpUrl() {
        return str("help.file");
    }

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

    return {
        init: init, // (callback)
        str: str, // (name, ...subs)
        getHelpUrl: getHelpUrl, // ()
        refreshLanguage: refreshLanguage, // ()
        getLanguageList: getLanguageList, // (): { {"key", "description",
        genPig: genPig, // ()
    }

})();
