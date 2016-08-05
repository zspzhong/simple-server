var _ = require('lodash');
var Sequelize = require('sequelize');

var defaultOption = {
    timestamps: false,
    freezeTableName: true
};
var _table2Fields = {};

exports.define = define;
exports.table2Fields = table2Fields;

function define(modelName, attributes, options) {
    _table2Fields[modelName] = _.keys(attributes);

    if (_.isEmpty(define.sequelize)) {
        define.sequelize = instance();

        setTimeout(function () {
            define.sequelize.sync().then(function () {
                define.sequelize.close();
                delete define.sequelize;
            });
        }, 5 * 1000);
    }

    define.sequelize.define(modelName, attributes, _.extend((options || {}), defaultOption));
}

function table2Fields(tableName) {
    return _table2Fields[tableName] || [];
}

function instance() {
    return new Sequelize(global.mysqlOption.database, global.mysqlOption.user, global.mysqlOption.password, {
        host: global.mysqlOption.host,
        dialect: 'mysql',
        pool: {
            max: 1,
            min: 0,
            idle: 10000
        }
    });
}
