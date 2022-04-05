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

        Handlebars.registerHelper('icrpg-array', function() {
            return Array.prototype.slice.call(arguments, 0, -1);
        });

        Handlebars.registerHelper('icrpg-includes', function (array, value) {
            return array.includes(value);
        });

        Handlebars.registerHelper('icrpg-is', function(a, b, opts) {
            if (a == b) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
        });

        Handlebars.registerHelper("icrpg-sum", function (a, b) {
            return a + b;
        });

        Handlebars.registerHelper("icrpg-effortable", function (item, opts) {
            if ("effortFormula" in item.data.data) return opts.fn(this);
            return opts.inverse(this);
        });

        Handlebars.registerHelper("icrpg-quantity", function (item, opts) {
            if (!["spell", "ability"].includes(item.type)) return opts.fn(this);
            return opts.inverse(this);
        });

        Handlebars.registerHelper("icrpg-has", function (item, property, opts) {
            if (property in item.data.data) return opts.fn(this);
            return opts.inverse(this);
        });

        Handlebars.registerHelper("icrpg-localize", function (key) {
            if (!key) return "";
            return game.i18n.localize(`ICRPG.${key}`);
        });
    }
}
