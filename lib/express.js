var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();
var logger = require('./logger');
var fs = require('fs');

exports.init = init;

function init() {
    _views();
    _parse();
    _ip();
    _ipFilter();
    _sessionStore();
    _middleware();
    _devSetup();

    return app;

    function _views() {
        if (global.appOption.viewEngine) {
            app.set('view engine', global.appOption.viewEngine);
        }
        if (global.appOption.viewPath) {
            app.set('views', global.appOption.viewPath);
        }
    }

    function _parse() {
        app.use('/', bodyParser.urlencoded({extended: false}));
        app.use('/', bodyParser.json());
        app.use('/', cookieParser());
    }

    function _ip() {
        app.use('/', function (req, res, next) {
            req.ip = (req.headers['x-real-ip'] || req.ip || '').replace('::ffff:', '');
            next(null);
        });
    }

    // 若指定白名单, 则白名单外不可访问
    function _ipFilter() {
        if (_.isEmpty(global.whiteList)) {
            return;
        }

        app.use('/', function (req, res, next) {
            if (_.includes(global.whiteList, req.ip)) {
                next(null);
                return;
            }

            logger.info('Forbidden visit from', req.ip);
            next(403);
        });
    }

    function _sessionStore() {
        if (global.appOption.sessionStore === false) {
            return;
        }

        var redisHost = (global.redisOption && global.redisOption.host) || '127.0.0.1';
        var redisPort = (global.redisOption && global.redisOption.port) || 6379;
        app.use('/svc', session({
            store: new RedisStore({
                host: redisHost,
                port: redisPort,
                ttl: 3600 * 24 * 30
            }),
            cookie: {
                maxAge: 2 * 60 * 60 * 1000
            },
            resave: false,
            saveUninitialized: false,
            secret: 'simple'
        }));
    }

    function _middleware() {
        if (_.isEmpty(global.appOption.middleware)) {
            return;
        }

        _.each(global.appOption.middleware, function (item) {
            var appPath = global.appEnv.srcPath + '/middleware/' + item.name;
            var serverPath = global.frameworkLibPath + '/middleware/' + item.name;
            try {
                appPath = require.resolve(appPath);
                app.use(item.path || '/', require(appPath)(item.options));
            }
            catch (e) {
                try {
                    serverPath = require.resolve(serverPath);
                    app.use(item.path || '/', require(serverPath)(item.options));
                }
                catch (e) {
                    logger.warn('middleware is not found', item);
                }
            }
        });
    }

    function _devSetup() {
        if (global.appEnv.mode !== 'dev') {
            return;
        }

        app.use('/svc', function (req, res, next) {
            logger.info(req.method, req.url);
            next(null);
        });

        if (global.appEnv.devStaticPath) {
            app.use('/', express.static(global.appEnv.devStaticPath));
        }
    }
}