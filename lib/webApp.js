require('./config').init();

var _ = require('lodash');
var logger = require('./logger');
var app = require('./express').init();

require(global.frameworkLibPath + '/app-manage/appManage').startAllApp(app);

// error handle
app.use(function (err, req, res, next) {
    if (err) {
        logger.error(req.url, err);

        res.writeHead(res.statusCode || 200, {'Content-Type': 'application/json;charset=UTF-8'});
        if (_.isUndefined(err.code)) {
            res.end(JSON.stringify({code: 1, result: err}));
            return;
        }

        res.end(JSON.stringify(err));
    }
});