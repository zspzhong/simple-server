var _ = require('lodash');

exports.register = register;

function register(middlewareInfo, expressApp) {
    var middlewareList = [];

    _.each(middlewareInfo.middleware, function (item) {
        var path = item.path || global.frameworkLibPath + '/middleware/' + item.name;
        middlewareList.push(require(path)(item.options));
    });

    if (_.isEmpty(middlewareList)) {
        return;
    }

    expressApp.use(middlewareInfo.path, middlewareList);
}