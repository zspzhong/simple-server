var async = require('async');
var mysql = require('mysql');

var pool = mysql.createPool({
    host: global.mysqlOption.host,
    port: global.mysqlOption.port || 3306,
    user: global.mysqlOption.user,
    password: global.mysqlOption.password,
    database: global.mysqlOption.database,
    connectionLimit: global.mysqlOption.connectionLimit
});

exports.execSql = execSql;
exports.batchExecSql = batchExecSql;

function execSql(sql, value, callback) {
    connection(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }

        connection.query(sql, value, function (err, result) {
            connection.release();
            callback(err, result);
        });
    });
}

function batchExecSql(sqlList, callback) {
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

            async.eachLimit(sqlList, 10, _execOneSql, _execDone);

            function _execOneSql(oneSql, callback) {
                connection.query(oneSql.sql, oneSql.value, callback);
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