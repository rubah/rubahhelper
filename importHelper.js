module.exports = {
    helperName: 'import',
    handlebars: function(data) {
        let res = '';
        for(const key in data){
            res+='import '+key+' from "'+data[key]+'";\n';
        }
        return data;
    },
    map: function(value) {
        const regex = /import (.*?)from['"](.*?)['"];/
        const bracket = /{(.*)}/
        value = value.trim();
        const res = {};
        while(value.length > 0){
            const x = regex.exec(value);
            let v = x[1].trim();
            if(bracket.test(v))
                v = '{'+bracket.exec(v)[1].split(',').map(a=>a.trim()).join(',')+'}';
            res[v]=x[2];
            value = value.substr(x['index']+x[0].length);
        }
        return res;
    }
}