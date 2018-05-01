'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('users', {
        id: { type: 'int', primaryKey: true },
        username: 'string',
        roleID: 'int',
        token: 'string',
        salt: 'string',
        hashedPassword: 'string',
    	token: 'string',
    	createdDate: 'string',
    	modifiedDate: 'string',
  	})
  	.then(function() {
	    return db.createTable('userRoles', {
	        id: { type: 'int', primaryKey: true },
	        name: 'string',
	  	});
  	})
  	.then(function() {
	    return db.insert('userRoles', {
	    	name: 'admin'
	    });
  	});
};

exports.down = function(db) {
  	return null;
};

exports._meta = {
  	"version": 1,
};
