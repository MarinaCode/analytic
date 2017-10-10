/**
 * Created by Marina on 03.02.2017.
 */
// var utils = require('../helpers/utils');
// var Base = require('./base');
var User = function(data){
    for(var key in data){
        this[key] = data[key];
    }
};

// utils.extend(User,Base);

module.exports = User;

