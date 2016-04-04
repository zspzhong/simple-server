var _ = require('lodash');
var fs = require('fs');

exports.init = init;

function init() {
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

// 避免IDE unresolved提示, never to call this
function avoidUnresolved() {
    global.frameworkLibPath = '';

    global.appEnv = {
        mode: '',
        port: '',
        rootPath: '',
        srcPath: '',
        logPath: '',
        baseUrl: ''
    };

    global.appOption = {
        servicePrefix: '',
        viewEngine: '',
        viewPath: '',
        middleware: []
    };

    global.framework = '';
    global.mysqlOption = {
        connectionLimit: '',
    };

    global.mongoOption = {
        database: ""
    };

    avoidUnresolved();
}