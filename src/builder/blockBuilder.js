module.exports = function(name,...blocks) {
    return {
        blocks,
        helperName: name,
        // extract: function(value){
        //     let res = [];
        //     for (const block of this.blocks) {
        //         if(!value) break;
        //         let start = value.indexOf(block.start);
        //         const begin = start;
        //         const type = block.type || "unknown";
        //         if (!block.inclusive) start = start + block.start.length;
        //         let end = value.indexOf(block.end);
        //         const remPos = end + block.end.length;
        //         if (block.inclusive) end = remPos;
        //         if (start > -1 && end > -1) {
        //             let data = value.substring(start, end);
        //             if (typeof block.map == 'function') data = block.map(data);
        //             const remains = value.substr(remPos);
        //             res.push({ start: begin, end: remPos, type, data, remains })
        //         }
        //     }
        //     if(res.length == 0) return null;
        //     res.sort((a, b) => a.start - b.start);
        //     const ent = [];
        //     if(res[0].start>0){
        //         ent.push({type: "other", data: value.substr(0,res[0].start)});
        //     }
        //     ent.push(res[0]);
        //     res = ent.map(x=>{
        //         return {type: x.type, data: x.data}
        //     })
        //     return {
        //         data: res,
        //         remains: ent[0].remains
        //     }
        // },
        
        // map: function(value) {
        //     let x, remains = value;
        //     const res = [];
        //     do{
        //         x = this.extract(remains);
        //         if(x) {
        //             res.push(...x.data);
        //             remains = x.remains;
        //         }
        //     }while(x);
        //     if(remains && remains.length>0){
        //         res.push({type: "other", data: remains});
        //     }
        //     return res;
        // },
        
        map: function(value) {
            let x;
            const res = [];
            let tokens = [];
            for(const block of this.blocks){
                tokens.push(...block.extract(value));
            }
            tokens.sort((a,b)=>{
                if(a.start != b.start) return a.start-b.start;
                return a.end - b.end;
            });
            let cur = 0;
            while(tokens.length>0){
                let token = tokens.shift();
                if(token.start > cur){
                    res.push({type: "default", data: value.substring(cur,token.start)});
                }
                cur = token.end;
                res.push({type: token.type, data: token.data});
                while(tokens.length>0 && tokens[0].start <= cur)
                    tokens.shift();
            }
            if(cur < value.length){
                res.push({type: "default", data: value.substr(cur)});
            }
            return res;
        },
        handlebars: function(data) {
            let res = '';
            const blocks = {};
            for(const b of this.blocks){
                blocks[b.type] = b;
            }
            for(const d of data){
                if (d.type == "default") res+=d.data;
                else {
                    if(Object.keys(blocks).indexOf(d.type)==-1)
                        throw new Error("unrecognized block: "+d.type);
                    const bl = blocks[d.type];
                    res+=bl.apply(d.data);
                }
            }
            return res;
        }
    }
}