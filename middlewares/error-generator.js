var errorGenerator = function(req, res, next) {
    req.createError = function(statusCode, message) {

        var error = new Error();
        if (!statusCode) {
            statusCode = 500;
        }

        error.status = statusCode;
        
        if (message) {
            error.message = message;
        } else {
            switch (statusCode) {
                case 400: error.message = 'Bad Request'; break;
                case 401: error.message = 'Unauthorized'; break;
                case 403: error.message = 'Forbidden'; break;
                case 404: error.message = 'Not Found'; break;
                case 500: error.message = 'Internal Server Error'; break;
            }
        }
        return error;
    };
    next();
};

module.exports = function() {
    return errorGenerator;
}