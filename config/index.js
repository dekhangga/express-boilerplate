// default config
// config property should only be 1 level deep, doesn't support 2 level config for now 
// because it will be overwritten when extending by .env.json
var _     = require('underscore');
var merge = require('merge');
var fs    = require('fs');
var path  = require('path');

var config = {};

/**
 * Load all config files (.json) in config directory.
 * 
 * @return {void}
 */
function loadConfigFiles() {
    fs.readdirSync(__dirname+'/parts')
    .forEach(function(file) {
        var conf = require('./parts/' + file);
        if (conf) {
            _.each(conf, function(value, key) {
                config[key] = value;
            });
        }
    });
}

/**
 * Load environment file.
 * 
 * @return {void}
 */
function loadEnv() {
    try {
        var env = require('./env.json');
        if (env) {
            // merge 1 level only
            _.each(env, function(value, key) {
                if (typeof config[key] === 'object') {
                    config[key] = _.extend(config[key], value);
                } else {
                    config[key] = value;
                }                
            });
        }
    } catch (ex){
        console.error('Error: ' + ex);
    }
}

loadConfigFiles();
loadEnv();

module.exports = config;

