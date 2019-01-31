const assert = require("assert");
const index = require("../index");
const jsxHelper = index.jsxHelper;
const jsonHelper = index.jsonHelper;
const importHelper = index.importHelper;
const commentHelper = index.commentHelper;
const yamlHelper = index.yamlHelper;

describe("jsonHelper",function(){
    it("should reverse jsonHelper",function(done){
        const a = {a: {b: {c: 1}}};
        const json = jsonHelper.handlebars(a);
        assert.deepEqual(jsonHelper.map(json),a);
        done();
    });
    it("should reverse yamlHelper",function(done){
        const a = {a: {b: {c: 1}}};
        const yaml = yamlHelper.handlebars(a);
        assert.deepEqual(yamlHelper.map(yaml),a);
        done();
    });
    
    it("should reverse jsxHelper",function(done){
        // rubah.register(index('.','.'));
        // rubah.scan(undefined,x=>console.log(''));
        
        const orig =         
            `<div className="test" onClick={()=>{this.props.time.set("time",Date.now()); }}>
            <Helmet>
            <title>Test</title>
            <meta name="description" content="Description of Test" />
            </Helmet>
            <FormattedMessage {...messages.header} />
            <div>{this.props.time.get()}</div>
            </div>`;
        
        assert.doesNotThrow(function(){JSON.stringify(jsxHelper.map(orig))});
        done();
    });
    
    it("should reverse importHelper",function(done){
        const a = {http: 'http'};
        const data = importHelper.handlebars(a);
        assert.deepEqual(importHelper.map(data),a);
        done()
    });
    
    it("should reverse commentHelper",function(done){
        const a = 'a\nb\nc';
        const data = commentHelper.handlebars(a);
        assert.equal(commentHelper.map(data),a);
        done();
    });
}); 