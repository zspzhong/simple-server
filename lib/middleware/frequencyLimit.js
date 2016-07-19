var _ = require('lodash');
var logger = require('../logger');
var async = require('async');
var redis = require('../utils/redisUtils').instance();

// ip调用频率限制
exports = module.exports = function (options) {
    options = options || {};
    var maxRequestPreSecond = options.maxRequestPreSecond || 10;

    // todo support inner request whiteList or something

    return function (req, res, next) {
        var second = Math.floor(Date.now() / 1000);
        var key = 'req_' + req.clientIp + '_' + second;
        var frequency = 0; // times/second

        async.series([_get, _incr], function (err) {
            if (err) {
                next(err);
                return;
            }

            if (frequency < maxRequestPreSecond) {
                next(null);
                return;
            }

            logger.warn(req.clientIp, 'request frequency reach limit', maxRequestPreSecond);
            next(403);
        });

        function _get(callback) {
            redis.get(key, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }

                if (_.isEmpty(result)) {
                    callback(null);
                    return;
                }

                frequency = Number(result);
                callback(null);
            });
        }

        function _incr(callback) {
            var pipeline = redis.pipeline();
            pipeline.incr(key);
            pipeline.expire(key, 1);

            pipeline.exec(callback);
        }
    }
};