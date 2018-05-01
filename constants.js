function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true,
    });
}

// define constants here
define('TEST_CONSTANT', 'TestConstant');
