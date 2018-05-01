var express   = require('express')
  , crypto    = require('crypto')
  , uuid      = require('node-uuid')
  , models    = require('../models')
  , constants = require('../constants')
  , Promise = require('bluebird');

var router = express.Router();

module.exports = function(di) {

    // Route Listing
    router.post('/sign-in', signIn);
    router.post('/register', register);
    router.post('/sign-out', function(req, res, next) {
        di.authentication.isAuthenticated(req, res, next, signOut);
    });

    /**
     * Authenticate user.
     * 
     * @param  {IncomingMessage} req (username: string, password: string)
     * @param  {ServerResponse}  res
     * @param  {Function}        next
     * @return {void}
     */
    function signIn(req, res, next) {
        return Promise.try(function () {
            var username = req.body.username || -9999,
                password = req.body.password;

            if (!username || !password) {
                throw new di.error(400, 'Missing parameters');
            }

            return di.authentication.signIn(
                username,
                password
            )
        })
        .then(function (login) {
            res.sendApi({ SignIn: login }, next);
        })
        .catch(function (err) {
            return next(err);
        });
    }

    /**
     * Register user.
     * 
     * @param  {IncomingMessage} req (username: string, password: string)
     * @param  {ServerResponse}  res
     * @param  {Function}        next
     * @return {void}
     */
    function register(req, res, next) {
        return Promise.try(function () {
            return di.authentication.register(req.body)
        })
        .then(function (user) {
            res.sendApi({ User: user }, next);
        })
        .catch(function (err) {
            return next(err);
        });
    }

    /**
     * Logout user.
     * 
     * @param  {IncomingMessage} req
     * @param  {ServerResponse}  res
     * @param  {Function}        next
     * @return {void}
     */
    function signOut(req, res, next, login) {
        di.authentication.signOut(req, res, next, login)
        .then(function() {
            res.sendApi({ message: 'Deauthenticated' }, next);
        });
    }

    return router;
};