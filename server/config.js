var env = process.env.NODE_ENV || 'local';


var config = require('./config.json')[env];

if(!config){
    throw new Error("Unknown env "+env);
}
config.env = env;
module.exports = config;