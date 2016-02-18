var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var router = require(global.frameworkLibPath + '/router/router');

module.exports = Application;

function Application(appName, metaPath, expressApp) {
    this.appName = appName;
    this.metaPath = metaPath;
    this.expressApp = expressApp;
    this.metaInfo = JSON.parse(fs.readFileSync(this.metaPath));
}

Application.prototype.start = function () {
    this.loadModel();
    this.loadInitial();
    this.loadService();
    this.loadViews();
};

Application.prototype.loadModel = function () {
    var modelPath = this.metaInfo['modelPath'];
    if (_.isEmpty(modelPath)) {
        return;
    }

    require(path.join(global.appEnv.srcPath, this.appName, modelPath));
};

Application.prototype.loadInitial = function () {
    var initialInfo = this.metaInfo['initial'];
    if (_.isEmpty(initialInfo)) {
        return;
    }

    var realizeFile = require(path.join(global.appEnv.srcPath, this.appName, 'initial', initialInfo['realizeFile']));
    var realizeFunction = realizeFile[initialInfo['realizeFunction']];

    realizeFunction(this.expressApp);
};

Application.prototype.loadService = function () {
    var that = this;

    _.each(this.metaInfo['serviceList'], function (item) {
        var realizeFile = require(path.join(global.appEnv.srcPath, that.appName, 'service', item['realizeFile']));
        var realizeFunction = realizeFile[item['realizeFunction']];

        var serviceInfo = {
            path: item['path'],
            method: item['method'],
            realizeFunction: realizeFunction,
            oauth: item['oauth']
        };

        router.register(serviceInfo, that.expressApp);
    });
};

Application.prototype.loadViews = function () {
    var that = this;

    _.each(this.metaInfo['views'], function (item) {
        var views = that.expressApp.get('views') || [];
        if (_.isString(views)) {
            views = [views];
        }

        views.push(global.appEnv.srcPath + '/' + that.appName + '/' + item);
        views = _.uniq(views);

        that.expressApp.set('views', views);
    });
};