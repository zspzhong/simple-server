var _ = require('lodash');
var path = require('path');
var fs = require('fs');

module.exports = Application;

function Application(appName, metaPath, expressApp) {
    this.appName = appName;
    this.metaPath = metaPath;
    this.expressApp = expressApp;
    this.metaInfo = JSON.parse(fs.readFileSync(this.metaPath));

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
    _.each(this.metaInfo.serviceList, function (item) {
        if (_.isEmpty(item.middleware)) {
            item.middleware = [];
            return;
        }

        var list = [];
        _.each(item.middleware, function (one) {
            var path = one.path || global.frameworkLibPath + '/middleware/' + one.name;
            list.push(require(path)(one.options));
        });

        item.middleware = list;
    });
};

Application.prototype.loadService = function () {
    var that = this;

    _.each(this.metaInfo.serviceList, function (item) {
        var realizeFile = require(path.join(global.appEnv.srcPath, that.appName, 'service', item.realizeFile));

        var method = _.isArray(item.method) ? item.method : [item.method];
        var realizeAfterWrap = _wrapRealize(realizeFile[item.realizeFunction]);

        _.each(method, function (oneMethod) {
            var args = _.concat(item.path, item.middleware, realizeAfterWrap);
            that.expressApp[oneMethod].apply(that.expressApp, args);
        });
    });

    // 统一全局返回的JSON格式
    function _wrapRealize(realize) {
        return function (req, res, next) {
            realize(req, res, function (err, result) {
                if (err) {
                    next(err);
                    return;
                }

                result = result || {};
                if (_.isUndefined(result.code)) {
                    result = _.assign({code: 0}, {result: result});
                }

                // 统一result格式: {msg: string|option}
                if (_.isString(result.result)) {
                    result.result = {msg: result.result};
                }

                res.writeHead(res.statusCode || 200, {'Content-Type': 'application/json;charset=UTF-8'});
                res.end(JSON.stringify(result));
            });
        };
    }
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