var Redis = require('ioredis');
var _ = require('lodash');
var defaultOption = {
    port: global.redisOption.port,
    host: global.redisOption.host
};

exports.instance = instance;

function instance(options) {
    return new Redis(_.extend(_.extend({}, defaultOption), options));
}