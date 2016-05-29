var _ = require('lodash');
var fs = require('fs');

exports.init = init;

function init() {
    var terminalArg = _parseArg();

    if (terminalArg.config) {
        _.assign(terminalArg, JSON.parse(fs.readFileSync(terminalArg.config)));
    }

    if (terminalArg.framework) {
        _.assign(terminalArg, JSON.parse(fs.readFileSync(terminalArg.framework)));
    }

    _valueFromEnv(terminalArg);
    _.assign(global, terminalArg);

    function _parseArg() {
        var result = {};

        var parseRule = {
            '-f': 'framework',
            '-c': 'config',
            '-m': 'mode',
            '-a': 'app'
        };

        var arg = process.argv;
        _.each(arg, function (item, index) {
            if (!_.includes(item, '-') || _.isEmpty(parseRule[item])) {
                return;
            }

            result[parseRule[item]] = arg[index + 1];
        });

        return result;
    }


    function _valueFromEnv(objLike) {
        if (!_.isObjectLike(objLike)) {
            return;
        }

        _.each(objLike, function (value, key) {
            if (_.isObjectLike(value)) {
                _valueFromEnv(value);
                return;
            }

            if (_.isString(value) && _.startsWith(value, 'env.')) {
                objLike[key] = process.env[value.replace('env.', '')];
            }
        });
    }
}