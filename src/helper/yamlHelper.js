const YAML = require("yamljs");

module.exports = {
    helperName: 'yaml',
    handlebars: function(data) {
        return YAML.stringify(data);
    },
    map: function(value) {
        return YAML.parse(value);
    }
}