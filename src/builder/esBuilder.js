const espree = require("espree");
Error.stackTraceLimit = Infinity;
const util = require('util');
const source =
`const assert = require("assert");
const index = require("../index");
let blockBuilder = index.blockBuilder;
//test
describe("blockBuilder",function(){
    it("should extract blocks",function(){
        const block1 = {
            type: 'block1', 
            start:'1', 
            end:'3', 
            inclusive:true, 
            map: x=>(Number.parseInt(x)*2).toString(), 
            handlebars: x=>(Number.parseInt(x)/2).toString()
        };
        let helper = blockBuilder('testBlock',block1);
        let mapped = helper.map('1234567');
        assert.deepEqual(mapped,[ { type: 'block1', data: '246' },{ type: 'other', data: '4567' } ]);
        assert.equal(helper.handlebars(mapped),'1234567');
        const block2 = {
            type: 'block2', 
            start:'5', 
            end:'7', 
            map: x=>'a'+x, 
            handlebars: x=>x.substr(1)
        };
        helper = blockBuilder('testBlock',block1,block2);
        mapped = helper.map('1234567');
        assert.deepEqual(mapped,[ { type: 'block1', data: '246' },{ type: 'other', data: '4' },{ type: 'block2', data: 'a6' } ]);
        assert.equal(helper.handlebars(mapped),'1234567');
    });
});
it("should do something",function(){
});
blockBuilder = null;
function x(a,b,c){
    return 1;
}
y => 1;
(function(a){console.log(a)})(1)
`;

const ast = espree.parse(source, { ecmaVersion: 7, comment: true });
// const esquery = require("esquery");
// let matches = esquery(ast, "[callee.name='it']");
// console.log(matches);
// res[3].args[1]=parse(res[3].args[1]);
// console.log(util.inspect(res,{showHidden: false, depth: 6}));
// const ast2 = espree.parse("//test \n it();\n ", { ecmaVersion: 7, comment: true });

// console.log(ast2);
