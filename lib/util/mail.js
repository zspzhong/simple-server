var _ = require('lodash');
var logger = require('../logger');
var nodeMailer = require('nodemailer');
var transporter = nodeMailer.createTransport();

exports.sendMail = sendMail;
exports.errorNotification = errorNotification;

function sendMail(options, callback) {
    var defaultOptions = {
        to: 'shasharoman@foxmail.com',
        from: 'shasha@simple.com',
        subject: 'none'
    };

    transporter.sendMail(_.assign(defaultOptions, options), callback);
}

function errorNotification(err) {
    var mail = {
        subject: '错误通知',
        text: JSON.stringify(err)
    };

    sendMail(mail, function (err) {
        if (err) {
            logger.error(err);
        }
    });
}