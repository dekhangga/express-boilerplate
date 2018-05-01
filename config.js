var env = process.env.NODE_ENV || 'development';
var docker = process.env.DOCKER || 'false';

var config;
if (env === 'test'){
    config = require('./config/test');
} else if (env === 'development' && docker === 'true') {
    config = require('./config/docker');
} else {
    config = require('./config/index');
}

module.exports = config;
