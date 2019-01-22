module.exports = {
    helperName: 'comment',
    handlebars: function(data) {
        return '/**\n *\n * '+data.toString().split('\n').join('\n * ')+'\n *\n **/';
    },
    map: function(value) {
        value = value.substr(10).split('\n * ').join('\n');
        value = value.substr(0,value.length - 8);
        return value;
    }
}