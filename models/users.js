'use strict';

module.exports = function(sequelize, DataTypes) {
    var ssaclAttributeRoles = require('ssacl-attribute-roles'),
        user = sequelize.define('user', {});

    ssaclAttributeRoles(sequelize);
    ssaclAttributeRoles(user);

    user = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: DataTypes.STRING,
        token: DataTypes.STRING,
        salt: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'createdDate',
        updatedAt: 'modifiedDate',
    });

    return user;
};
