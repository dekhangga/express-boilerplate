'use strict';

module.exports = function(sequelize, DataTypes) {
    var ssaclAttributeRoles = require('ssacl-attribute-roles'),
        userRole = sequelize.define('userRole', {});

    ssaclAttributeRoles(sequelize);
    ssaclAttributeRoles(userRole);

    userRole = sequelize.define('userRoles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING
    }, {
        tableName: 'userRoles',
        timestamps: false
    });

    return userRole;
};
