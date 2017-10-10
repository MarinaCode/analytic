var fs   = require('fs');
var path = require('path');
var _    = require('underscore');

export class EJS {

    path:String;
    data:Object;
    source:Function;

    constructor(options:EJS){
        this.path = options.path;
        this.data = options.data;
        this.source = this.compile();
    }

    compile(){
        var text = fs.readFileSync(this.path,'utf8');
        return _.template(text);
    }

    toString(data){
        if(data){
           return this.source(data);
        }
        if(this.data){
            return this.source(this.data);
        }
        return this.source();
    }

    toSource(){
        return this.source;
    }

    static compile(options:EJS){
        return new EJS(options);
    }

}
