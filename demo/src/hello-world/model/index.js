var mongoose = require('mongoose');
var logger = require(global.frameworkLibPath + '/logger');
var uri = 'mongodb://' + global.mongoOption.host + '/' + global.mongoOption.database;

mongoose.connect(uri, {server: {poolSize: 100}}, function (err) {
    if (err) {
        logger.error(err);
        process.exit(1);
        return;
    }

    defineSchema();
});

function defineSchema() {
    require('./helloWorld');
}

// mysql
//var Sequelize = require('sequelize');
//var sequelize = new Sequelize(global.mysqlOption.database, global.mysqlOption.user, global.mysqlOption.password, {
//    host: global.mysqlOption.host,
//    dialect: 'mysql',
//    pool: {
//        max: global.mysqlOption.connectionLimit,
//        min: 0,
//        idle: 10000
//    }
//});
//
//sequelize.define('hello_world', {
//    text: Sequelize.STRING
//});
//sequelize.sync();