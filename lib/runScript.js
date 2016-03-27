init();

function init() {
    require('./config').init();
    require(global.appEnv.srcPath + '/' + global.app).run();
}