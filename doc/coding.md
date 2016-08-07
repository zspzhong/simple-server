# 编码说明

## 命名
* 文件夹采用 "-" 连接单词, 如: `simple-server`, `app-manage`
* 文件名采用驼峰式
* 变量名采用驼峰式, 内部`function`名使用 "_" 打头
* `url`, `params`, `query`采用驼峰式
* 数据库, 表名, 字段名使用 "_" 连接单词

## 语法
* 不省略分号, 不多分号
* 回调嵌套尽量不超过3层
* 保持`require`, `exports`部分集中在文件头部 

## 端口
* 8001: simple-blog
* 8002: simple-archive
* 8003: simple-stock
* 8004: simple-auth
* 8005: simple-zzz
* 8006: simple-sms

## 公共模块使用
* 应用服务相互调用统一使用`lib/util/inner`
* logger统一使用`lib/logger`
* redis统一使用`lib/util/redis`
* mysql统一使用`lib/dao/dataUtil`