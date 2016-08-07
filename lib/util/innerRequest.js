// 内部通信
var request = require('request');
var urlTools = require('url');
var _ = require('lodash');
var logger = require('../logger');

exports.get = _.curry(withoutBodyHelper, 2)('GET');
exports.delete = _.curry(withoutBodyHelper, 2)('DELETE');
exports.post = _.curry(withBodyHellper, 2)('POST');
exports.put = _.curry(withBodyHellper, 2)('PUT');

function withoutBodyHelper(method, url, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.assign({
        method: method,
        uri: fullUrl(url),
        json: true
    }, options);

    var start = Date.now();
    request(options, function (err, res, result) {
        if (err) {
            logger.error('inner request', method, options.uri, err);
            callback(err);
            return;
        }

        logger.info('inner request', method, options.uri, res.statusCode, (Date.now() - start) + 'ms');

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, result.result);
            return;
        }

        callback(result);
    });
}

function withBodyHellper(method, url, data, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.assign({
        method: method,
        uri: fullUrl(url),
        body: data,
        json: true
    }, options);

    var start = Date.now();
    request(options, function (err, res, result) {
        if (err) {
            logger.error('inner request', method, options.uri, err);
            callback(err);
            return;
        }

        logger.info('inner request', method, options.uri, res.statusCode, (Date.now() - start) + 'ms');

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, result.result);
            return;
        }

        callback(result);
    });
}

function fullUrl(url) {
    var urlObj = urlTools.parse(url);

    if (_.isEmpty(urlObj.host) && global.appEnv.baseUrl) {
        var base = urlTools.parse(global.appEnv.baseUrl);

        url = urlTools.format(_.assign(urlObj, {
            protocol: base.protocol,
            host: base.host,
            port: base.port,
            hostname: base.hostname
        }));
    }

    return url;
}