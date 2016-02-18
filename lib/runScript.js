init();

function init() {
    require('./initSystemValue.js').init();
    require(global.appEnv.srcPath + '/' + global.app).run();
}