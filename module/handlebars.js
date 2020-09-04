import { IcrpgUtility } from "./utility.js";

export class IcrpgRegisterHelpers {
    static init() {
        Handlebars.registerHelper('icrpg-assign', function (varName, varValue, options) {
            if (!options.data.root) {
                options.data.root = {};
            }
            options.data.root[varName] = varValue;
        });

        Handlebars.registerHelper('icrpg-randomid', function (prefix) {
            return IcrpgUtility.getRandomId(prefix);
        });

        Handlebars.registerHelper('icrpg-concat', function () {
            var outStr = '';
            for (var arg in arguments) {
                if (typeof arguments[arg] != 'object') {
                    outStr += arguments[arg];
                }
            }
            return outStr;
        });

        Handlebars.registerHelper('icrpg-capitalize', function (str) {
            if (typeof str !== 'string') return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        });

        Handlebars.registerHelper('icrpg-toUpperCase', function (str) {
            return str.toUpperCase();
        });

        Handlebars.registerHelper('icrpg-toLowerCase', function (str) {
            return str.toLowerCase();
        });

        Handlebars.registerHelper('icrpg-preview', function (content, length) {
            return TextEditor.previewHTML(content, Number(length));
        });

    }
}
