var models              = require('../models');

var UserService = function() {

    this.getAllUsers = function() {
        return models.users.findAndCountAll({
            attributes: ['id', 'username'],
            include: [{
                model: models.userRoles,
                attributes: ['name'],
            }],
        });
    };
};

module.exports = new UserService();
