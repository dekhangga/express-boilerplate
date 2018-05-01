var _       = require('lodash');
var config  = require('../config');

var RegexValidation = function() {

    /**
    * Return true whenever it is valid email
    */
    this.emailValidation = function(email) {
        var regexEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return regexEmail.test(email);
    }

    /**
    * Return true whenever it is valid name
    */
    this.nameValidation = function(name) {
        var regexName = /^[a-zA-ZÁáÅåÄÇçÉéÑñÜüÖö0-9:\'\,\.\-\/ ]+$/;
        return regexName.test(name);
    }

    /**
    * Return true whenever it is valid phone
    */
    this.phoneValidation = function(phone) {
        var regexPhone = /^[+]?([\d]{3}(-| )?[\d]{3}(-| )?[\d]{4}|[\d]{5,12}|}|[(][\d]{3}[)](-| )?[\d]{3}(-| )?[\d]{4})$/;
        return regexPhone.test(phone);
    }

    /**
    * Return true whenever it is valid number
    */
    this.numberValidation = function(number) {
        var regexNumber = /^[0-9]+$/;
        return regexNumber.test(number);
    }

    /**
     * Return number or false from string number
     * @param {String} numberString
     * @return {Object} success or error (and what causes it when available)
     */
    this.currencyConvert = function (numberString) {
        var numberExtracted;
        var onlyCurrencyNumberRegex = /^\d[0-9,.]*$/;
        var doneExtracting = false;

        _.each(config.currency[config.countryCode], function (text) {
            if (!doneExtracting) {
                var regex = new RegExp(text, 'ig');
                numberExtracted = numberString.replace(regex, '');
                numberExtracted = numberExtracted.trim();

                if (onlyCurrencyNumberRegex.test(numberExtracted)) {
                    doneExtracting = true;
                }
            }
        });

        if (!doneExtracting) {
           return {
               success: false,
               wrongCurrency: true
           };
        }

        var numberDotDecimal = numberExtracted.split('.');
        var numberCommaDecimal = numberExtracted.split(',');

        // check if comma or dot thousand
        var isDotDecimal = (numberDotDecimal.length === 2 &&
            numberDotDecimal[numberDotDecimal.length - 1].length <= 2);
        var isCommaDecimal = (numberCommaDecimal.length === 2 &&
            numberCommaDecimal[numberCommaDecimal.length - 1].length <= 2);

        // check if natural separated
        if (!isDotDecimal && !isCommaDecimal) {
            if ((numberDotDecimal.length > 1) && (numberDotDecimal[numberDotDecimal.length - 1].length === 3)) {
                isCommaDecimal = true;
            } else if ((numberCommaDecimal.length > 1) &&
                (numberCommaDecimal[numberCommaDecimal.length - 1].length === 3)) {
                isDotDecimal = true;
            }
        }

        // check if unnatural separated
        if ((!isDotDecimal && !isCommaDecimal) && (numberDotDecimal.length > 1 || numberCommaDecimal.length > 1)) {
            if (numberDotDecimal[numberDotDecimal.length - 1].length > 3) {
                isDotDecimal = true;
            } else if (numberCommaDecimal[numberCommaDecimal.length - 1].length > 3) {
                isCommaDecimal = true;
            }
        }

        if (isDotDecimal) {
            if (numberDotDecimal.length > 2) {
                return {
                    success: false
                };
            }

            return {
                numberParsed: parseFloat(numberExtracted.replace(/,/g, '')),
                success: true
            };
        } else if (isCommaDecimal) {
            if (numberCommaDecimal.length > 2) {
                return {
                    success: false
                };
            }

            return {
                numberParsed: parseFloat(numberExtracted.replace(/\./g, '').replace(',', '.')),
                success: true
            };
        }

        var numberCleaned = numberExtracted.replace(/\./g, '').replace(',', '');
        if (!isNaN(numberCleaned)) {
            return {
                numberParsed: numberCleaned,
                success: true
            };
        }

        return {
            success: false
        };
    };

    /**
    * Return true whenever it is a valid decimal
    */
    this.decimalValidation = function(number) {
        var regexDecimal = /^\d+(\.\d+)?$/;
        return regexDecimal.test(number);
    }

};

module.exports = new RegexValidation();
