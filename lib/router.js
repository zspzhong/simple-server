var _ = require('lodash');
var logger = require(global.frameworkLibPath + '/logger');
var request = require('request');

exports.register = register;

function register(serviceInfo, expressApp) {
    // 所有注册的服务都加上svc前缀
    var servicePrefix = (global.appOption.servicePrefix ? '/' + global.appOption.servicePrefix : '');
    var path = '/svc' + servicePrefix + serviceInfo.path;
    var realizeAfterWrap = _wrapRealize(serviceInfo.realizeFunction);

    if (_.isEmpty(serviceInfo.auth)) {
        expressApp[serviceInfo.method](path, realizeAfterWrap);
        return;
    }

    // authToken
    if (serviceInfo.auth === 'authToken') {
        if (_.isEmpty(global.appEnv.authUrl)) {
            logger.error('use authToken need config authUrl');
            expressApp[serviceInfo.method](path, realizeAfterWrap);
            return;
        }

        expressApp[serviceInfo.method](path, _authToken);
    }

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

                res.writeHead(res.statusCode || 200, {'Content-Type': 'application/json;charset=UTF-8'});
                res.end(JSON.stringify(result));
            });
        };
    }

    function _authToken(req, res, next) {
        tokenCheck(req, res, function (err, pass, result) {
            if (err) {
                next(err);
                return;
            }

            if (!pass) {
                res.writeHead(401, {'Content-Type': 'text/plain;charset=UTF-8'});
                res.end('Unauthorized');
                return;
            }
            req.username = result.username;

            realizeAfterWrap(req, res, next);
        });
    }
}

function tokenCheck(req, res, callback) {
    var token = encodeURIComponent(req.query.accessToken || req.body.accessToken || req.headers['x-access-token']);
    if (_.isEmpty(token)) {
        callback(null, false);
        return;
    }

    var url = global.appEnv.authUrl + '/svc/auth/token/check?token=' + token;
    var options = {
        method: 'GET',
        uri: url,
        json: true
    };

    request(options, function (err, res, result) {
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, true, result.result);
            return;
        }
        
        callback(null, false);
    });
}