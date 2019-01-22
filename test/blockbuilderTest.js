const assert = require("assert");
const index = require("../index");
const blockBuilder = index.blockBuilder;

describe("blockBuilder",function(){
    it("should extract blocks",function(){
        const block1 = index.staticMarkBlock('block1','1','3',{
            inclusive:true, 
            map: x=>(Number.parseInt(x)*2).toString(), 
            mapback: x=>(Number.parseInt(x)/2).toString()
        });
        let helper = blockBuilder('testBlock',block1);
        let mapped = helper.map('1234567');
        assert.deepEqual(mapped,[ { type: 'block1', data: '246' },{ type: 'default', data: '4567' } ]);
        assert.equal(helper.handlebars(mapped),'1234567');
        const block2 = index.staticMarkBlock('block2','5','7',{
            map: x=>'a'+x, 
            mapback: x=>x.substr(1)
        });
        helper = blockBuilder('testBlock',block1,block2);
        mapped = helper.map('1234567');
        assert.deepEqual(mapped,[ { type: 'block1', data: '246' },{ type: 'default', data: '4' },{ type: 'block2', data: 'a6' } ]);
        assert.equal(helper.handlebars(mapped),'1234567');
    });
});