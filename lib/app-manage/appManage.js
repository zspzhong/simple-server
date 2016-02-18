var _ = require('lodash');
var path = require('path');
var logger = require('../logger');
var Application = require('./application');

exports.startAllApp = startAllApp;

function startAllApp(expressApp) {
    var appList = global['applicationList'];

    _.each(appList, function (item) {
        startApp(item, expressApp);

        logger.info(item + ' start success');
    });

    expressApp.listen(global.appEnv.port);

    logger.info('all app start success');
}

function startApp(appName, expressApp) {
    var appMetaPath = path.join(global.appEnv.srcPath, appName, 'meta-info.json');

    new Application(appName, appMetaPath, expressApp).start();
}