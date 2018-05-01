var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, + Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage });

module.exports = function(di) {

    router.post('/', upload.single('file'), function (req, res, next) {
        di.authentication.isAuthenticated(req, res, next, function(req, res, next, login) {
            res.sendApi(req.file.destination + req.file.filename);
        });
    });  

    return router;
}
