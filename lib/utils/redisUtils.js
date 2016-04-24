var Redis = require('ioredis');
var _ = require('lodash');
var defaultOption = {
    host: (global.redisOption && global.redisOption.host) || '127.0.0.1',
    port: (global.redisOption && global.redisOption.port) || 6379
};

exports.instance = instance;

function instance(options) {
    return new Redis(_.extend(_.extend({}, defaultOption), options));
}