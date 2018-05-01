var crypto   = require('crypto')
  , passport = require('passport')
  , uuid     = require('node-uuid')
  , models   = require('../models')
  , moment   = require('moment')
  , _        = require('lodash')
  , Promise  = require('bluebird')
  , request  = require('request')
  , config   = require('../config')
  , constants  = require('../constants');
var requestAsync = Promise.promisify(request);
var jwt = require ('jsonwebtoken');

var Authentication = function(di) {

    var apiKey                      = 'token'
      , hash                        = 'md5'
      , authentication              = this;

    this.isAuthenticated = function(req, res, next, callback) {
        if (!config.usingAuth) {
            let user = {
                username: 'dummy',
                roleID: 1
            };
            return callback(req, res, next, user);
        }

        const signedToken = req.headers && req.headers['token'];
        jwt.verify(signedToken, 'express-boilerplate', (err, {token} = {}) => {
            if (err || !token) {
                next(di.handler.error(req, res, new di.error(403, 'Auth failed')));
            }

            return models.users.findOne({
                where: {
                    token: token
                }
            })
            .then((user) => {
                if (!user) {
                    next(di.handler.error(req, res, new di.error(403, 'Auth failed')));
                }

                req.user = user;
                return callback(req, res, next, user);
            })
        })
    }

    function encryptUsingSHA256AndSalt(plainText, salt) {
        return crypto.createHash('sha256').update(plainText + salt).digest('hex');
    }

    function randomBytes(length = 512) {
        return crypto.randomBytes(length).toString('hex')
    }

    this.signIn = function(username, password) {
        var token, signedToken, userID;
        return models.users.findOne({
            where: { 
                username: username 
            }
        })
        .then(function validateUserLogins(user) {
            if (!user) {
                throw new di.error(
                    404,
                    'User not found'
                );
            }

            const {salt, hashedPassword} = user;
            const hashPassword = encryptUsingSHA256AndSalt(password, salt);
            userID = user.userId;

            if (hashPassword !== hashedPassword) {
                throw new di.error(
                    404,
                    'Username and password do not match'
                );
            }

            token = crypto.randomBytes(50).toString('hex');
            signedToken = jwt.sign({
                token: token
            }, 'express-boilerplate', { expiresIn: '3d'});

            return models.users.update({
                token: token,
            }, {
                where: {
                   username: username 
                }
            });
        })
        .then(function (response) {
            return signedToken;
        });
    }

    this.register = function(body) {        
        return models.users.findOne({
            where: {
                username: body.username
            }
        })
        .then(function (user) {
            if (user) {
                throw new di.error(
                    400,
                    'Username already taken'
                );
            }
            body.salt = crypto.randomBytes(50).toString('hex');
            body.hashedPassword = encryptUsingSHA256AndSalt(body.password, body.salt);
            body.roleID = 1;
            delete body.password;
            return models.users.create(body);
        })
    }

    this.signOut = function(req, res, next, login) {
        return models.users.update({
            token: null
        }, {
            where: {
               username: login && login.dataValues.username 
            }
        });
    }

}

module.exports = function(di) {
    return new Authentication(di);
};
