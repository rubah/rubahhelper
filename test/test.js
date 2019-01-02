const assert = require("assert");
const rubah = require("rubahjs");
const index = require("../index");
const jsxHelper = require("../jsxHelper")

describe("test",function(){
    it("should test",function(done){
        // rubah.register(index('.','.'));
        // rubah.scan(undefined,x=>console.log(''));
        
        const orig =         `<div className="test" onClick={()=>{this.props.time.set("time",Date.now()); }}>
        <Helmet>
          <title>Test</title>
          <meta name="description" content="Description of Test" />
        </Helmet>
        <FormattedMessage {...messages.header} />
        <div>{this.props.time.get()}</div>
      </div>`;
        console.log(JSON.stringify(jsxHelper.map(orig)));
        console.log('==========')
        console.log(jsxHelper.handlebars(jsxHelper.map(orig)))
        
        assert(true);
        done();
    })
}); 