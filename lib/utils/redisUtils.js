var Redis = require('ioredis');

exports.instance = instance;

function instance() {
    // 集中从此处获取redis instance, 便于后续设置全局配置项
    return new Redis();
}