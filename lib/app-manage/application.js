var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var router = require(global.frameworkLibPath + '/router');
var middleware = require(global.frameworkLibPath + '/middleware');

module.exports = Application;

function Application(appName, metaPath, expressApp) {
    this.appName = appName;
    this.metaPath = metaPath;
    this.expressApp = expressApp;
    this.metaInfo = JSON.parse(fs.readFileSync(this.metaPath));

    // add path prefix
    if (_.isEmpty(this.metaInfo.serviceList)) {
        return;
    }

    var servicePrefix = (global.appOption.servicePrefix ? '/' + global.appOption.servicePrefix : '');
    _.each(this.metaInfo.serviceList, function (item) {
        item.path = '/svc' + servicePrefix + item.path;
    });
}

Application.prototype.start = function () {
    this.loadInitial();
    this.loadMiddleware();
    this.loadService();
    this.loadViews();
};

Application.prototype.loadInitial = function () {
    var initial = this.metaInfo.initial;
    if (_.isEmpty(initial)) {
        return;
    }

    require(path.join(global.appEnv.srcPath, this.appName, initial));
};

Application.prototype.loadMiddleware = function () {
    var that = this;

    _.each(this.metaInfo.serviceList, function (item) {
        if (_.isEmpty(item.middleware)) {
            return;
        }

        var middlewareInfo = {
            path: item.path,
            middleware: item.middleware
        };

        middleware.register(middlewareInfo, that.expressApp);
    });
};

Application.prototype.loadService = function () {
    var that = this;

    _.each(this.metaInfo.serviceList, function (item) {
        var realizeFile = require(path.join(global.appEnv.srcPath, that.appName, 'service', item.realizeFile));
        var realizeFunction = realizeFile[item.realizeFunction];

        var serviceInfo = {
            path: item.path,
            method: _.isArray(item.method) ? item.method : [item.method],
            realizeFunction: realizeFunction
        };

        router.register(serviceInfo, that.expressApp);
    });
};

Application.prototype.loadViews = function () {
    var that = this;

    _.each(this.metaInfo.views, function (item) {
        var views = that.expressApp.get('views') || [];
        if (_.isString(views)) {
            views = [views];
        }

        views.push(global.appEnv.srcPath + '/' + that.appName + '/' + item);
        views = _.uniq(views);

        that.expressApp.set('views', views);
    });
};