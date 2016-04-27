// 内部通信
var request = require('request');
var urlTools = require('url');
var _ = require('lodash');
var logger = require('../logger');

exports.get = get;
exports.post = post;

function get(url, callback) {
    var options = {
        method: 'GET',
        uri: fullUrl(url),
        json: true
    };

    var start = Date.now();
    request(options, function (err, res, result) {
        logger.info('GET', options.uri, res.statusCode, (Date.now() - start) + 'ms');
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, result.result);
            return;
        }

        callback(result);
    });
}

function post(url, data, callback) {
    var options = {
        method: 'POST',
        uri: fullUrl(url),
        body: data,
        json: true
    };

    var start = Date.now();
    request(options, function (err, res, result) {
        logger.info('POST', options.uri, res.statusCode, (Date.now() - start) + 'ms');
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode === 200 && result.code === 0) {
            callback(null, result.result);
            return;
        }

        callback(result);
    });
}

function fullUrl(url) {
    if (global.appEnv.baseUrl) {
        var base = urlTools.parse(global.appEnv.baseUrl);

        url = urlTools.format(_.assign(urlTools.parse(url), {
            protocol: base.protocol,
            host: base.host,
            port: base.port,
            hostname: base.hostname
        }));
    }

    return url;
}