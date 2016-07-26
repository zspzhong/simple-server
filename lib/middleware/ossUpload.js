var multer = require('multer');
var OSS = require('ali-oss').Wrapper;
var _ = require('lodash');
var concat = require('concat-stream');
var crypto = require('crypto');

function OssStorage(ossClient) {
    this.ossClient = ossClient;
}

OssStorage.prototype._handleFile = function (req, file, callback) {
    var that = this;

    file.stream.on('error', callback);
    file.stream.pipe(concat(function (data) {
        var fileName = crypto.createHash('md5').update(data).digest('hex');
        that.ossClient.put(fileName, data).then(function () {
            var ossUrl = global.appEnv.ossUpload.ossDomain + '/' + fileName;
            callback(null, {ossUrl: ossUrl});
        }).catch(callback);
    }));
};

OssStorage.prototype._removeFile = function (req, file, callback) {
    callback(null);
};

exports = module.exports = function (options) {
    if (_.isEmpty(options)) {
        options = global.appEnv.ossUpload;
    }

    if (_.isEmpty(options)) {
        throw new Error('use oss upload middleware need config ossUpload in appEnv');
    }

    var upload = multer({storage: new OssStorage(new OSS(options))});
    return upload.single('file');
};
