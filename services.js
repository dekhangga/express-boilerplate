var services = {};

function includeService(name, service) {
    services[name] = require('./services/' + service);
}

includeService('user', 'UserService');

module.exports = services;
