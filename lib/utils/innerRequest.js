// 内部通信
var request = require('request');
var urlTools = require('url');
var _ = require('lodash');
var logger = require('../logger');

exports.get = get;
exports.post = post;

function get(url, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.assign({
        method: 'GET',
        uri: fullUrl(url),
        json: true
    }, options);

    var start = Date.now();
    request(options, function (err, res, result) {
        if (err) {
            callback(err);
            return;
        }

        logger.info('GET', options.uri, res.statusCode, (Date.now() - start) + 'ms');

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, result.result);
            return;
        }

        callback(result);
    });
}

function post(url, data, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.assign({
        method: 'POST',
        uri: fullUrl(url),
        body: data,
        json: true
    }, options);

    var start = Date.now();
    request(options, function (err, res, result) {
        if (err) {
            callback(err);
            return;
        }

        logger.info('POST', options.uri, res.statusCode, (Date.now() - start) + 'ms');

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