var exec = require('cordova/exec');

exports.openGisIntent = function (arg0, arg1, arg2, success, error) {
    exec(success, error, 'OpenIntent', 'openGisIntent', [arg0, arg1, arg2]);
};
