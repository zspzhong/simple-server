var async = require('async');
var _ = require('lodash');
var mysql = require('mysql');
var logger = require('../logger');

var pool = mysql.createPool({
    host: global.mysqlOption.host,
    port: global.mysqlOption.port || 3306,
    user: global.mysqlOption.user,
    password: global.mysqlOption.password,
    database: global.mysqlOption.database,
    connectionLimit: global.mysqlOption.connectionLimit
});

exports.execSql = execSql;
exports.seriesExecSql = seriesExecSql;
exports.batchExecSql = batchExecSql;

function execSql(sql, value, callback) {
    connection(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }

        var start = Date.now();
        connection.query(sql, value, function (err, result) {
            logger.sql(sql, value, (Date.now() - start) + 'ms');
            connection.release();
            callback(err, result);
        });
    });
}

function seriesExecSql(sqlList, callback) {
    return batchExecSql(sqlList, 1, callback);
}

function batchExecSql(sqlList, concurrent, callback) {
    if (_.isFunction(concurrent)) {
        callback = concurrent;
        concurrent = 10;
    }

    connection(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }

        connection.beginTransaction(function (err) {
            if (err) {
                connection.release();
                callback(err);
                return;
            }

            async.eachLimit(sqlList, concurrent, _execOneSql, _execDone);

            function _execOneSql(oneSql, callback) {
                var start = Date.now();
                connection.query(oneSql.sql, oneSql.value, function (err) {
                    logger.sql(oneSql.sql, oneSql.value, (Date.now() - start) + 'ms');
                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null);
                });
            }

            function _execDone(err) {
                if (err) {
                    _rollback(err);
                    return;
                }

                connection.commit(function (err) {
                    if (err) {
                        _rollback(err);
                        return;
                    }

                    connection.release();
                    callback(null);
                });
            }

            function _rollback(err) {
                connection.rollback(function () {
                    connection.release();
                    callback(err);
                });
            }
        });
    });
}

function connection(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }

        connection.config.queryFormat = function (query, values) {
            if (!values) {
                return query;
            }

            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };

        callback(null, connection);
    });
}