require('./config').init();

var _ = require('lodash');
var logger = require('./logger');
var app = require('./express').init();

require(global.frameworkLibPath + '/app-manage/appManage').startAllApp(app);

// error handle
app.use(function (err, req, res, next) {
    if (err) {
        if (_.isNumber(err)) {
            _standardCodeHandle(err);
            return;
        }

        logger.error(req.url, err);

        if (_.isString(err)) {
            err = {msg: err};
        }

        res.writeHead(res.statusCode || 200, {'Content-Type': 'application/json;charset=UTF-8'});
        if (_.isUndefined(err.code)) {
            res.end(JSON.stringify({code: 1, result: err}));
            return;
        }

        res.end(JSON.stringify(err));
    }

    function _standardCodeHandle(statusCode) {
        var msg = '';

        switch (statusCode) {
            case 401:
                msg = 'Unauthorized';
                break;
            case 403:
                msg = 'Forbidden';
                break;
            case 404:
                msg = 'Not Found';
                break;
            default:
                msg = 'Unknown Error';
        }

        res.writeHead(statusCode, {'Content-type': 'text/plain;charset=UTF-8'});
        res.end(msg);
    }
});