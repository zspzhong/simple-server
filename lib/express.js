var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();
var logger = require('./logger');

exports.init = init;

function init() {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    if (global.appOption.viewEngine) {
        app.set('view engine', global.appOption.viewEngine);
    }

    if (global.appOption.viewPath) {
        app.set('views', global.appOption.viewPath);
    }

    _devSetup();

    app.use('/svc', cookieParser());

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

    if (!_.isEmpty(global.appOption.middleware)) {
        _.each(global.appOption.middleware, function (item) {
            app.use(item.path ? '/' : item.path, require(global.appEnv.srcPath + '/middleware/' + item.name));
        });
    }

    return app;

    function _devSetup() {
        if (global.appEnv.mode === 'dev') {
            app.use('/svc', function (req, res, next) {
                logger.info(req.method, req.url);
                next(null);
            });

            if (global.appEnv.devStaticPath) {
                app.use('/', express.static(global.appEnv.devStaticPath));
            }
        }
    }
}