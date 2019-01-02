const espree = require("espree");
const fs = require("fs");
const file = x=>fs.readFileSync(x).toString();
const path = require("path")
const gen = require("escodegen");

module.exports = function(base,watch){
    return {
    templateName: 'jsfile',
    //template of filename
    filename: path.resolve(watch,'./{{filename}}.js'),
    //handlebar template of file content
    template: '{{jsfile content}}',
    // Map from state-tree into multiple data that will be applied to the template
    stateToData: function(state){
        return [state];
    },
    // Map from template extraction into state tree
    dataToState: function(data){
        const res = {};
        res[data.filename]={};
        res[data.filename].filename = data.filename;
        res[data.filename].content = data.content;
        console.log(res);
        return res;
    },
    partials: [
        // {name: 'testpartial', template: 'test {{data}}'}
        ],
    helpers: [
        //{
            // helperName: string (required)
            // handlebars(conText, options): function (required) handlebars (block) helper function
            // textFound(result, text): function (optional) reverse action when text found on block helper
            // textNotFound(result, text) (optional) reverse action when text not found on block helper
            // varFound(result, name, value) (optional) reverse action when variable found on block helper
            // chain(newHelper) (optional) reverse action for nesting context
            // init(tokens, content, context) reverse action when start reversing template token
            // end(tokens, content, result, context) reverse action when end reversing template token
            // map(value) (required for non-block helper) reverse action of mapping value
        //}
        {
            helperName: 'jsfile',
            handlebars: function(data){
                return data;
            },
            map(value){
                const res = {require: {}};
                const ast = espree.parse(value,{ecmaVersion: 7, comment: true});
                if(ast.type == 'Program')
                    for(const node of ast.body){
                        if(node.type == "ExpressionStatement" && node.expression.type == "AssignmentExpression" && node.expression.operator == "="){
                            const left = node.expression.left;
                            const right = node.expression.right;
                            if(left.type == "Identifier" && right.type == "CallExpression" && right.callee.name == 'require'){
                                res.require[left.name]=right.arguments[0].value;
                            }
                        }
                        if(node.type == "VariableDeclaration")for(const dec of node.declarations){
                            if(dec.type == "VariableDeclarator" && dec.init.type == "CallExpression" && dec.init.callee.name == 'require'){
                                res.require[dec.id.name]=dec.init.arguments[0].value;
                            }
                        }
                    }
                    // res.code = Buffer.from(value.toString()).toString('base64');
                return res;
            }
        }
        ]
    }
}
//--