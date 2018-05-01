var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var parsetrace = require('parsetrace');
var errorGenerator = require('../middlewares/error-generator');
var responseApi = require('../middlewares/response-api');
var allowAjax = require('../middlewares/allow-ajax');
var app = express();

module.exports = function(di) {

    app.set('port', di.config.port);
    app.set('trust proxy', true);

    app.disable('x-powered-by');  
    
    app.use(bodyParser.json({ limit:di.config.app.request_limit }));
    app.use(bodyParser.urlencoded({ extended: true, limit: di.config.app.request_limit }));
    app.use(expressValidator());
    app.use(cookieParser());
    app.use('/client', express.static('client'));

    // allow ajax request
    app.use(allowAjax({
        origins: di.config.ajax.origins,
        allowCredential: true,
    }));

    app.use(errorGenerator());
    app.use(responseApi());
    
    // application route, exclude method OPTIONS
    app.use('/', function(req, res, next) {
        if (req.method === 'OPTIONS') {
            res.send();
        } else {
            di.router(req, res, next);
        }
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers    
    app.use(function(err, req, res, next) {
        err.status = err.status || err.code || 500;
        res.status(err.status);

        var stacktrace = parsetrace(err).object();
        //var stacktrace = err.stack;
        // for logging
        res.errorBody = JSON.stringify({
            message: err.message
        });

        var result = {
            error: {
                message: err.message,
                code: err.status
            }
        };

        if (di.config.app.debug) {
            result.stacktrace = stacktrace.frames;
            //result.stacktrace = stacktrace;
        }

        res.send(result);
    });

    return app;
}
