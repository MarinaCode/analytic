var config = require('../../config');
var request = require('request');
var _  = require('underscore');
var API = function(){

    var service = config.services['server'];
    // this.username = service.username;
    // this.password = service.password;
    this.uri = service.url;
    this.session = {};
};

//TODO must be integrate
API.prototype.authorize = function(reset){
    // if(!reset){
    //     reset = false;
    // }
    // if(this.session.token && !reset && this.session.expiredTime >=new Date().getTime()){
    //     return Promise.resolve(this.session);
    // }
    // return new Promise(function(resolve,reject){
    //     request({
    //         uri: this.uri+'/auth/connection/',
    //         method: "POST",
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify()
    //     }, function(error, response, body) {
    //         try {
    //             if(error || response.statusCode >= 400 ){
    //                 if(!reset){
    //                     this.session = {};
    //                     return resolve(this.authorize(true));
    //                 }
    //                 return reject(body);
    //             }
    //             this.session = JSON.parse(body);
    //             this.session.expiredTime = new Date().getTime() + (60 * 60 * 24 * 900);
    //             return resolve(this.session);
    //         }catch (e){
    //             reject(e);
    //         }
    //
    //     }.bind(this));
    // }.bind(this))

};

API.prototype.request = function(params){
    return new Promise(function(resolve,reject){
        //this.authorize().then(function(result){
           if(!params.headers){
               params.headers = {};
           }
           if(!params.body){
               params.body = {};
           }
            request({
                uri: this.uri + params.url,
                method: params.method,
                headers: _.extend(params.headers, {
                    'content-type': 'application/json'
                }),
                body: JSON.stringify(params.body)
            }, function(error, response, body) {
                try {
                    if(error || response.statusCode >= 400 ){
                        return reject(JSON.parse(body));
                    }
                    return resolve(JSON.parse(body));
                }catch (e){
                    return reject(e);
                }
            }.bind(this));
        //}.bind(this))
        //    .catch(function(err){
        //        if(typeof err !='object'){
        //            try {
        //                reject(JSON.parse(err));
        //            }catch (e){
        //                reject(err);
        //            }
        //        }else{
        //            reject(err);
        //        }
        //
        //    }.bind(this));
    }.bind(this));

}


module.exports = new API();