var _ = require('lodash');
var fs = require('fs');

function init() {
    initConfig();
}

function initConfig() {
    var terminalArg = _parseArg();

    if (terminalArg.config) {
        _.extend(terminalArg, JSON.parse(fs.readFileSync(terminalArg.config)));
    }

    if (terminalArg.framework) {
        _.extend(terminalArg, JSON.parse(fs.readFileSync(terminalArg.framework)));
    }

    _.extend(global, terminalArg);

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

exports.init = init;