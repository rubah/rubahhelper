module.exports = function(type, start, end, options){
    if(!type) throw Error("unexpected type: "+type);
    if(!start || start.length==0) throw Error("error in start block: "+start);
    if(!end || end.length==0) throw Error("error in end block: "+end);
    const map = options.map;
    const mapback = options.mapback;
    const inclusive = options.inclusive
    return {
        type, start, end, map, mapback, inclusive,
        extract: function(value){
            let res = [];
            let cur = 0;
            let idx = -1;
            do{
                if(!value) break;
                let start = value.indexOf(this.start, idx+1);
                const begin = start;
                if (!this.inclusive) start = start + this.start.length;
                let end = value.indexOf(this.end, idx+1);
                idx = end;
                const remPos = end + this.end.length;
                if (this.inclusive) end = remPos;
                if (start > -1 && end > -1) {
                    let data = value.substring(start, end);
                    if (typeof this.map == 'function') data = this.map(data);
                    const remains = value.substr(remPos);
                    res.push({ start: begin, end: remPos, type, data })
                }
            }while(idx > -1);
            return res;
        },
        apply: function(data){
            let b = typeof this.mapback == "function"?this.mapback(data):data.toString();
            if(!this.inclusive) b = this.start + b + this.end;
            return b
        }
    }
}