init();

function init() {
    require('./initSystemValue').init();
    require(global.appEnv.srcPath + '/' + global.app).run();
}