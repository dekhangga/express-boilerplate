var di = {};

// components that don't use dependency injection
di.config = require('./config');
di.sequelize = require('./components/sequelize');

function includeComponent(name, component) {
    di[name] = require('./components/' + component)(di);
}
function includeLibraries(name, component) {
    di[name] = require('./libraries/' + component);
}

// add components
includeComponent('router', 'router');
includeComponent('authentication', 'authentication');

// add libraries
includeLibraries('handler', 'handler');
includeLibraries('helper', 'helper');
includeLibraries('error', 'error');
includeLibraries('generator', 'generator');

// app and then server must be defined last
includeComponent('app', 'app');
if (di.config.environment !== 'test'){	// don't include server on test environment
    includeComponent('server', 'server');
}

// include services
di.services = require('./services');

module.exports = di;
