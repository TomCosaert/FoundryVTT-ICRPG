export class IcrpgRegisterHelpers {
    static init() {
        Handlebars.registerHelper('concat', function() {
            var outStr = '';
            for (var arg in arguments) {
              if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
              }
            }
            return outStr;
          });
        
        Handlebars.registerHelper('capitalize', function(str) {
            if (typeof str !== 'string') return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        });

        Handlebars.registerHelper('toUpperCase', function(str) {
            return str.toUpperCase();
        });

        Handlebars.registerHelper('toLowerCase', function(str) {
            return str.toLowerCase();
        });

        Handlebars.registerHelper('preview', function(content, length) {
            return TextEditor.previewHTML(content, Number(length));
        });
          
    }
}
