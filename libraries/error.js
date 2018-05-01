module.exports = function GeneralError(code, message, meta) {

    Error.captureStackTrace(this, this.constructor);
    
    this.message = message;
    this.code = code || 500;
    this.meta = meta || {};
}

require('util').inherits(module.exports, Error);
