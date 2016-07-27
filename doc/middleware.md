# 中间件

## authCheck
依赖auth服务, 检查token, 无效返回401, 有效继续后续逻辑, `req.accountId`可获取帐号id

## frequencyLimit
限制同一ip调用频率, 超出调用频率返回403
 
## ossUpload
针对multipart/form-data形式的文件上传, 直接上传到oss上, `req.ossUrl`可获取文件的访问地址