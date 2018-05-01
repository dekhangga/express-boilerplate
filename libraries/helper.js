var config  = require('../config');
var moment = require('moment-timezone');
var _ = require('lodash');
var crypto = require('crypto');
var xlsx = require('xlsx');
var constants = require('./../constants');

var Helper = function() {

    this.extend = function(object, parentObject) {
        for (var i in parentObject) {
            if (parentObject.hasOwnProperty(i)) {
                if (typeof object[i] == "object" && object.hasOwnProperty(i) && object[i] != null) {
                    this.extend(object[i], parentObject[i]);
                } else {
                    object[i] = parentObject[i];
                }
            }
        }
        return object;
    }

    /**
    * Return true whenever it is an array
    */
    function IsArray(val) {
        return Object.prototype.toString.call(val) == Object.prototype.toString.call([]);
    }

    /**
    * Helper To Wrap a singular value to array
    */
    this.WrapInArray = function(val) {
        if(val && !IsArray(val)) return [val];
        return val;
    }

    /**
    * Helper To Get Formatted Date
    */
    this.formatDate = function(date, tz, format) {
        var timezone = tz || config.timezoneArea
          , format = format || 'YYYY-MM-DD HH:mm:ss';

        var formatted = moment(date).tz(timezone).format(format);

        return formatted;
    }

    /**
    * To take into account that orders data on database are in UTC,
    * while given date is in timezone as specified in config
    */
    this.changeToUTCFromTimeZone = function (date) {
        var m = moment.utc(date).utcOffset(config.timezone);
        m.subtract(m.utcOffset(), 'minutes');
        return m;
    }

    /**
    * Helper to get attributes deeply on object without generating error
    */
    this.getDeepAttributes = function (obj, attributes) {
        return _.reduce(attributes.split('.'), function (res, attr) {
            return obj && typeof obj === 'object' ? res[attr] : null;
        }, obj);
    }

    /*
     * Check whether date is Invalid Date
     */
    this.isInvalidDate = function (date) {
        return (Object.prototype.toString.call(date) !== "[object Date]" ) || isNaN(date.getTime());
    }

    this.copyTimeFromAnotherDate = function(source, target) {
        target.setHours(source.getHours(), source.getMinutes(), source.getSeconds());
        return target;
    }

    /*
     * Convert date from SSF Date to Date
     */
    this.convertSsfDateToDate = function(ssfDate) {
        var val = new Date();
        val.setDate(ssfDate.d);
        val.setMonth(ssfDate.m-1);
        val.setFullYear(ssfDate.y);
        return val;
    }

    this.findDuplicates = function (array) {
        var arrayCountObjects = _.countBy(array);

        var duplicateItems = _.pickBy(arrayCountObjects, function(arrayCountObject) {
            return arrayCountObject > 1
        });

        return Object.keys(duplicateItems);
    }

    this.getJsonObjectFromFirstSheetOfExcelFile = function (file) {
        var workbook = xlsx.readFile(file),
            first_sheet = workbook.SheetNames[0],
            worksheet = workbook.Sheets[first_sheet];

        return xlsx.utils.sheet_to_json(worksheet, {raw: true});
    }

    this.toBoolean = function (value) {
        return (value === "true" || value === true || parseInt(value) > 0);
    }

    this.toNumber = function (value) {
        var convertedValue = Number(value);
        return (isNaN(convertedValue)) ? 0 : convertedValue;
    }

    /*
     * method for convert string or int to boolean for import order.
    */
    this.toBooleanImport = function (value) {
        value = value.toString();
        return (value && (value.toLowerCase() === "true" || value.toLowerCase() === "yes"
            || value === true || value === "1" ));
    }

    this.processMobilePhoneNumber = function (value) {
        if(value) {
            var phone = value.toString().replace(/[^0-9]/g, '');
            if (phone.startsWith(config.phone.countryCode)) {
                phone = phone.substring(config.phone.countryCode.length);
            } else if(phone.startsWith(config.phone.firstNumber)) {
                phone = phone.substring(config.phone.firstNumber.length);
            }
            return phone;
        } else{
            return "Empty";
        }
    }

    this.encryptUsingSHA256AndSalt = function (plainText, salt) {
        return crypto.createHash('sha256').update(plainText + salt).digest('hex');
    }

    this.isArrayContentTheSame = function (array, referenceArray) {
        var intersection = _.intersection(array, referenceArray);

        return (intersection.length === referenceArray.length);
    }

    this.generateRandomString = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        _.each(_.range(5), function () {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        });

        return text;
    }

    /**
     * Wrap the string in double quote for CSV needs
     */
    this.wrapDoubleQuote = function(str) {
        return '"' + str.replace(/"/g, '\\"') + '"';
    }

    this.isLatLngInvalid = function(lat, lng) {

        var eps = constants.LATITUDE_LONGITUDE_MINIMUM_VALUE;

        return (
            Math.abs(lat) < eps
            && Math.abs(lng) < eps
        );
    }
};

module.exports = new Helper();
