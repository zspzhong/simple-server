// 用户统一内部之间相互调用
var request = require('request');

exports.getResource = getResource;
exports.postResource = postResource;

function getResource(url, callback) {
    var options = {
        method: 'GET',
        uri: fillFullUrl(url),
        json: true
    };

    request(options, function (err, res, result) {
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode === 200) {
            if (result.code === 0) {
                callback(null, result.result);
                return;
            }

            callback(result);
            return;
        }

        callback('fail');
    });
}

function postResource(url, data, callback) {
    var options = {
        method: 'POST',
        uri: fillFullUrl(url),
        body: data,
        json: true
    };

    request(options, function (err, res, result) {
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode === 200) {
            if (result.code === 0) {
                callback(null, result.result);
                return;
            }

            callback(result);
            return;
        }

        callback('success');
    });
}

function fillFullUrl(url) {
    if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
        return url;
    }

    return global.baseUrl + url;
}