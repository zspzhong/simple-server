require('./config').init();

var app = require('./express').init();

require(global.frameworkLibPath + '/app-manage/appManage').startAllApp(app);

// error handle
app.use(function (err, req, res, next) {
    if (err) {
        res.end(JSON.stringify(err));
    }
});