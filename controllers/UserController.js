var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Promise = require('bluebird');
var config = require('../config');

module.exports = function(di) {

    router.get('/', function (req, res, next) {
        di.authentication.isAuthenticated(req, res, next, function(req, res, next, login) {
            return Promise.try(function checkAndBuildParams() {
                var query = req.query;
                return di.services.user.getAllUsers(query);
            })
            .then(function sendResponse(users) {
                res.sendApi(users);
            })
            .catch(function handleError(err) {
                return next(err);
            });
        });
    });

    return router;
}
