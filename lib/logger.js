var winston = require('winston');
var transports = [];

if (global.appEnv.mode === 'dev') {
    transports.push(new (winston.transports.Console)());
}

if (global.appEnv.mode === 'production') {
    transports.push(new (winston.transports.File)({
        name: 'info-file',
        filename: global.appEnv.logPath + '/access.log',
        level: 'info',
        json: false
    }));

    transports.push(new (winston.transports.File)({
        name: 'error-file',
        filename: global.appEnv.logPath + '/error.log',
        level: 'error',
        json: false,
        handleExceptions: true
    }));
}

var logger = new (winston.Logger)({
    transports: transports
});

exports.silly = silly;
exports.debug = debug;
exports.verbose = verbose;
exports.info = info;
exports.warn = warn;
exports.error = error;

function silly() {
    logger.silly.apply(logger, includeMeta.apply(null, arguments));
}

function debug() {
    logger.debug.apply(logger, includeMeta.apply(null, arguments));
}

function verbose() {
    logger.verbose.apply(logger, includeMeta.apply(null, arguments));
}

function info() {
    logger.info.apply(logger, includeMeta.apply(null, arguments));
}

function warn() {
    logger.warn.apply(logger, includeMeta.apply(null, arguments));
}

function error() {
    logger.error.apply(logger, includeMeta.apply(null, arguments));
}

function includeMeta() {
    var args = Array.prototype.slice.call(arguments);
    if (global.name) {
        args.splice(0, 0, global.name);
    }
    return args;
}