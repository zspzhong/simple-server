/**
 * 支持开发方便
 * */
var express = require('express');

exports.init = init;

function init(app) {
    if (global.appEnv.mode !== 'dev') {
        return;
    }

    if (global.appEnv.devStaticPath) {
        app.use(express.static(global.appEnv.devStaticPath));
    }
}