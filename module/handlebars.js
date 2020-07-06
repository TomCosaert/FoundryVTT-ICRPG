import { IcrpgUtility } from "./utility.js";

export class IcrpgRegisterHelpers {
    static init() {
        Handlebars.registerHelper('assign', function (varName, varValue, options) {
            if (!options.data.root) {
                options.data.root = {};
            }
            options.data.root[varName] = varValue;
        });

        Handlebars.registerHelper('randomid', function (prefix) {
            return IcrpgUtility.getRandomId(prefix);
        });

        Handlebars.registerHelper('concat', function () {
            var outStr = '';
            for (var arg in arguments) {
                if (typeof arguments[arg] != 'object') {
                    outStr += arguments[arg];
                }
            }
            return outStr;
        });

        Handlebars.registerHelper('capitalize', function (str) {
            if (typeof str !== 'string') return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        });

        Handlebars.registerHelper('toUpperCase', function (str) {
            return str.toUpperCase();
        });

        Handlebars.registerHelper('toLowerCase', function (str) {
            return str.toLowerCase();
        });

        Handlebars.registerHelper('preview', function (content, length) {
            return TextEditor.previewHTML(content, Number(length));
        });

    }
}
