module.exports = languageMiddleware;

function languageMiddleware(req, res, next) {
    req.language = 'zh-cn';
    next(null);
}