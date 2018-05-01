'use strict';

var Sequelize = require('sequelize');
var config    = require('../config');

var sequelize = new Sequelize(
    'null',
    'null',
    'null',
    {
        dialect: 'sqlite',
        storage: './database.db',
        logging: config.sequelize.logging,
    }
);

module.exports = sequelize;
