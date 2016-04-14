var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
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
    app.use('/svc', session({
        store: new MongoStore({
            url: 'mongodb://' + global.mongoOption.host + ':' + global.mongoOption.port + '/session'
        }),
        cookie: {
            maxAge: 2 * 60 * 60 * 1000
        },
        resave: true,
        saveUninitialized: true,
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