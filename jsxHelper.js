const espree = require("espree");
const gen = require("escodegen");
const setVal = require("lodash.set");
const getVal = require("lodash.get");
const trav = require("estraverse");
const compact = require("lodash.compact");

function jsxGen(data,prefix){
    prefix = prefix || '';
    let res = [];
    for(let k of Object.keys(data)){
        const d = data[k];
        if(d.name){
            const h = d.attributes?d.name+' '+d.attributes:d.name;
            if(d.children && d.children.length>0){
                res.push(prefix+'<'+h+'>');
                res.push(jsxGen(d.children,prefix+'\t'));
                res.push(prefix+'</'+d.name+'>');
            }else{
                res.push(prefix+'<'+h+' />');
            }
        }else if(d.expression){
            res.push(prefix+'{'+d.expression+'}');
        }else if(d.text){
            res.push(prefix+d.text);
        }
    }
    return res.join('\n');
}

module.exports = {
    helperName: 'json',
    handlebars: function(data) {
        return jsxGen([data]);
    },
    map: function(value) {
        const orig = value.toString();
        const ast = espree.parse(orig, { ecmaVersion: 7, comment: true, ecmaFeatures: { jsx: true } });
        let res = {};
        let path = [];

        trav.traverse(ast, {
            fallback: function(node) {
                return Object.keys(node).filter(function(key) {
                    return node.type != 'JSXElement' || key == 'children';
                });
            },
            enter: function(node, parent) {
                // console.log('entering '+node.type+' '+node.start);
                // console.log(path);
                switch (node.type) {
                    case 'JSXElement':
                        path.push('children.' + node.openingElement.start);
                        const val = { name: node.openingElement.name.name };
                        if (node.openingElement.attributes.length > 0) {
                            let min = Number.MAX_VALUE,
                                max = Number.MIN_VALUE;
                            for (const attr of node.openingElement.attributes) {
                                min = Math.min(min, attr.start);
                                max = Math.max(max, attr.end);
                            }
                            val.attributes = orig.substring(min, max);
                        }
                        setVal(res, path.join('.'), val);
                        break;
                    case 'JSXText':
                        path.push('children.' + node.start);
                        if (node.raw.trim().length > 0)
                            setVal(res, path.join('.'), { text: node.raw });
                        break;
                    case 'JSXExpressionContainer':
                        path.push('children.' + node.start);
                        setVal(res, path.join('.'), { expression: orig.substring(node.start, node.end) });
                        break;

                    default:
                        // code
                }
            },
            leave: function(node, parent) {
                // console.log('leaving '+node.type+' '+node.start);
                // console.log(path);
                switch (node.type) {
                    case 'JSXElement':
                        let ch = getVal(res, path.join('.'));
                        if (ch.children)
                            ch.children = compact(ch.children);
                        path.pop();
                        break;
                    case 'JSXText':
                        path.pop();
                        break;
                    case 'JSXExpressionContainer':
                        path.pop();
                        break;

                    default:
                        // code
                }
            }
        })
        res.children = compact(res.children);
        res = res.children[0];
        return res;
    }
}
