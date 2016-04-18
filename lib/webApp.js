require('./config').init();

var logger = require('./logger');
var app = require('./express').init();

require(global.frameworkLibPath + '/app-manage/appManage').startAllApp(app);

// error handle
app.use(function (err, req, res, next) {
    if (err) {
        logger.error(err);
        res.end(JSON.stringify(err));
    }
});