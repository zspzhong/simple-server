module.exports = allowCrossDomain;

// 允许跨域设置
function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Origin, Accept, Content-Type, X-HTTP-Method, X-HTTP-METHOD-OVERRIDE,XRequestedWith,X-Requested-With,xhr,custom-enterpriseId,x-clientappversion, x-wxopenid, x-devicetype');
    res.setHeader('Access-Control-Max-Age', '10');
    if ('OPTIONS' === req.method) {
        res.end("POST, GET, PUT, DELETE");
        return;
    }

    next();
}