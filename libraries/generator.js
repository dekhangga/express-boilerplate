/**
 * Created by ginanjar on 5/3/2016.
 */

var Promise = require('bluebird');
var crypto = Promise.promisifyAll(require('crypto'));

generator = {};

generator.randomString = function(length, chars) {
    if (!chars) {
        throw new Error('Argument ' + chars + ' is undefined');
    }

    var charsLength = chars.length;
    if (charsLength > 256) {
        throw new Error('Argument ' + chars + ' should not have more than 256 characters'
            + ', otherwise unpredictability will be broken');
    }

    return crypto.randomBytesAsync(length)
    .then(function(randomBytes){
        var result = new Array(length);

        var cursor = 0;
        for (var i = 0; i < length; i++) {
            cursor += randomBytes[i];
            result[i] = chars[cursor % charsLength];
        }

        return result.join('');
    });
}

generator.randomUppercase = function(length) {
    return this.randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

generator.randomBase64 = function(length) {
    return crypto.randomBytesAsync(length)
    .then(function(randomBytes) {
        var token = randomBytes.toString('base64')
            .replace(/=/g, '')  //trim trailing ==
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
        return token;
    });
}

generator.randomAlphanumeric = function(length) {
    return this.randomString(length,
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
}

generator.randomNumeric = function(length) {
    return this.randomString(length, '0123456789');
}

module.exports = generator;