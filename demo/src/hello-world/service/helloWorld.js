var logger = require(global.frameworkLibPath + '/logger');

exports.helloWorld = helloWorld;
exports.helloJade = helloJade;

function helloWorld(req, res, callback) {
    callback(null, 'hello world!');
}

function helloJade(req, res, callback) {
    res.render('helloJade.jade');
}