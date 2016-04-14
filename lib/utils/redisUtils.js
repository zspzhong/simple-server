var Redis = require('ioredis');
var _ = require('lodash');
var defaultOption = {
    port: (global.redisOption && global.redisOption.port) || '127.0.0.1',
    host: (global.redisOption && global.redisOption.host) || 6379
};

exports.instance = instance;

function instance(options) {
    return new Redis(_.extend(_.extend({}, defaultOption), options));
}