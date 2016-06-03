var _ = require('lodash');
var logger = require('./logger');
var globalMiddleWare = {
    authCheck: require('./middleware/authCheck')
};

exports.register = register;

function register(middlewareInfo, expressApp) {
    var middlewareList = [];

    _.each(middlewareInfo.middleware, function (item) {
        if (!_.isString(item)) {
            // todo support customize middleware
            return;
        }

        if (!_.isFunction(globalMiddleWare[item])) {
            logger.error('middleware not found:', item);
            return;
        }

        middlewareList.push(globalMiddleWare[item]);
    });

    if (_.isEmpty(middlewareList)) {
        return;
    }

    expressApp.use(middlewareInfo.path, middlewareList);
}