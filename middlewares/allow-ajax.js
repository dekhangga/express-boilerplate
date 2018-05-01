var allowAjax = function(options){
    return function(req, res, next){    
        // Website you wish to allow to connect
        if (options && options.origins) {
            for (var i in options.origins) {
                if (req.header('origin') == options.origins[i]) {
                    res.setHeader('Access-Control-Allow-Origin', options.origins[i]);
                }
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,LoginSessionKey,Authorization,token');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        if (options.allowCredential === true){
            res.setHeader('Access-Control-Allow-Credentials', options.allowCredential);
        }

        // Pass to next layer of middleware
        next();
    };
}

module.exports = function(options){
    console.log('Receiving ajax requests from ' + options.origins);
    return allowAjax(options);
};