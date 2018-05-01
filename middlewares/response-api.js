var _ = require('underscore')
  , Promise = require('bluebird');

responseApi = function(req, res, next) {
    res.sendApi = function(data, next, attr) {

        var loginSessionKey = req.header("LoginSessionKey") || data.LoginSessionKey;

        if (!data) {
            return next(req.createError(404));
        }

        var wrapper = {};
        wrapper.data = data;

        if (attr) {
            wrapper = _.extend(wrapper, attr);
        }

        res.send(wrapper);
        
    }
    next();
};

module.exports = function() {
    return responseApi;
}