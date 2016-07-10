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
        _tokenCheck(function (err, pass, result) {
            if (err) {
                next(err);
                return;
            }

            if (!pass) {
                next(401);
                return;
            }

            req.username = result.username;
            next(null);
        });

        function _tokenCheck(callback) {
            var token = encodeURIComponent(req.headers['x-token'] || req.body.token || '');
            if (_.isEmpty(token)) {
                callback(null, false);
                return;
            }

            var url = authUrl + '/svc/auth/token/check?token=' + token;
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
    }
};