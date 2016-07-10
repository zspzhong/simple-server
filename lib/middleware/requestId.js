var uuid = require('node-uuid');

exports = module.exports = function (req, res, next) {
    req.requestId = uuid.v4();
    next(null);
};