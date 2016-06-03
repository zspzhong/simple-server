var _ = require('lodash');
var logger = require(global.frameworkLibPath + '/logger');

exports.register = register;

function register(serviceInfo, expressApp) {
    var realizeAfterWrap = _wrapRealize(serviceInfo.realizeFunction);

    _.each(serviceInfo.method, function (item) {
        expressApp[item](serviceInfo.path, realizeAfterWrap);
    });

    // 统一全局返回的JSON格式
    function _wrapRealize(realize) {
        return function (req, res, next) {
            realize(req, res, function (err, result) {
                if (err) {
                    next(err);
                    return;
                }

                result = result || {};
                if (_.isUndefined(result.code)) {
                    result = _.assign({code: 0}, {result: result});
                }

                // 统一result格式: {msg: string|option}
                if (_.isString(result.result)) {
                    result.result = {msg: result.result};
                }

                res.writeHead(res.statusCode || 200, {'Content-Type': 'application/json;charset=UTF-8'});
                res.end(JSON.stringify(result));
            });
        };
    }
}