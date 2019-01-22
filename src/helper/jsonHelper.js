module.exports = {
    helperName: 'json',
    handlebars: function(data) {
        return JSON.stringify(data);
    },
    map: function(value) {
        return JSON.parse(value);
    }
}