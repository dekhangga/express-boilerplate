var express = require('express');
var router  = express.Router();

module.exports = function(di) {

    function defineRoute(router, path, controller, module) {
        var file = '../controllers/' + controller + 'Controller';
        if (module) {
            file = '../controllers/' + module + '/' + controller + 'Controller';
        }

        var controller = require(file)(di);
        router.use(path, controller);
    }

    var versionTwoRouter = express.Router();
    router.use('/api', versionTwoRouter);
    
    // Main Routes
    defineRoute(versionTwoRouter, '/', 'Auth');
    defineRoute(versionTwoRouter, '/users', 'User');
    defineRoute(versionTwoRouter, '/uploads', 'Upload');

    return router;
};
