var winston = require('winston');
var transports = [];
var sqlTransports = [];

var defaultLogPath = global.appEnv.rootPath + '/logs';
var logPath = global.appEnv.logPath || defaultLogPath;

if (global.appEnv.mode === 'dev') {
    transports.push(new (winston.transports.Console)());
    sqlTransports.push(new (winston.transports.Console)());
}

if (global.appEnv.mode === 'production') {
    transports.push(new (winston.transports.File)({
        name: 'info-file',
        filename: logPath + '/access.log',
        level: 'info',
        json: false,
        timestamp: function () {
            return new Date().toString();
        }
    }));

    transports.push(new (winston.transports.File)({
        name: 'error-file',
        filename: logPath + '/error.log',
        level: 'error',
        json: false,
        timestamp: function () {
            return new Date().toString();
        },
        handleExceptions: true
    }));

    sqlTransports.push(new (winston.transports.File)({
        name: 'sql-file',
        filename: logPath + '/sql.log',
        level: 'info',
        json: false,
        timestamp: function () {
            return new Date().toString();
        }
    }));
}

var logger = new (winston.Logger)({
    transports: transports
});

var sqlLogger = new (winston.Logger)({
    transports: sqlTransports
});

exports.silly = silly;
exports.debug = debug;
exports.verbose = verbose;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.sql = sql;

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

function sql() {
    sqlLogger.info.apply(sqlLogger, includeMeta.apply(null, arguments));
}

function includeMeta() {
    var args = Array.prototype.slice.call(arguments);
    if (global.name) {
        args.splice(0, 0, global.name);
    }
    return args;
}