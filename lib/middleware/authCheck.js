var _ = require('lodash');
var request = require('request');
var logger = require('../logger');

exports = module.exports = function (options) {
    options = options || {};
    var authUrl = options.authUrl || global.appEnv.authUrl;

    if (_.isEmpty(authUrl)) {
        throw new Error('use auth check middleware need config authUrl in appEnv');
    }

    return function (req, res, next) {
        var token = req.headers['x-token'] || req.body.token || req.query.token || '';

        _tokenCheck(function (err, pass, result) {
            if (err) {
                next(err);
                return;
            }

            if (!pass) {
                next(401);
                return;
            }

            req.token = token;
            req.accountId = result;
            next(null);
        });

        function _tokenCheck(callback) {
            if (_.isEmpty(token)) {
                callback(null, false);
                return;
            }

            var url = authUrl + '/svc/auth/token/check/' + encodeURIComponent(token);
            var options = {
                method: 'GET',
                uri: url,
                json: true
            };

            request(options, function (err, res, body) {
                if (err) {
                    callback(err);
                    return;
                }

                if (res.statusCode === 200 && body.code === 0) {
                    callback(null, body.result.isValid, body.result.accountId);
                    return;
                }

                callback(null, false);
            });
        }
    }
};