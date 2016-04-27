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
}