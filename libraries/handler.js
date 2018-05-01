var GeneralError = require('./error');

var Handler = function() {
    
    /**
    * Helper To Handle Error.
    * 
    * @param  {IncomingMessage} req
    * @param  {ServerResponse}  res
    * @param  {Error}           err
    * @return {void}
    */
    this.error = function(req, res, err) {
        
        if (typeof err === 'string') {
            err = new GeneralError(500, err);
        }

        return req.createError(err.code, err.message);
    };

};

module.exports = new Handler();
