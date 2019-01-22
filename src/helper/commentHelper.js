module.exports = {
    helperName: 'comment',
    handlebars: function(data) {
        if(data)
            return '/**\n *\n * '+data.toString().split('\n').join('\n * ')+'\n *\n **/';
        else 
            return '/**\n *\n * \n *\n **/';
    },
    map: function(value) {
        value = value.trim().substr(4);
        const prefix = value.substr(0,value.indexOf('*'));
        value = value.substr(0,value.length-3);
        value = value.split(prefix+'*').map(x=>x.substr(1,x.length-2));
        value.pop();
        value.shift();
        value.shift();
        value = value.join('\n');
        return value;
    }
}