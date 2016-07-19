var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var config = JSON.parse(fs.readFileSync(configPath()));

async.eachSeries(config.applicationList, makeOne, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }

    console.log('success');
    process.exit(0);
});

function makeOne(appName, callback) {
    var compiled = _.template(template());
    var metaInfo = JSON.parse(fs.readFileSync(config.appEnv.srcPath + '/' + appName + '/meta-info.json'));
    var docStream = fs.createWriteStream(config.appEnv.rootPath + '/doc/' + appName + '.md');

    var list = ['#' + appName + '\r\n'];
    _.each(_transService(), function (item) {
        list.push(compiled(item));
    });

    docStream.write(list.join('\r\n'), 'utf8', callback);
    docStream.end(null);

    function _transService() {
        return _.map(metaInfo.service, function (item) {
            if (!_.isEmpty(item.query)) {
                item.query = _parse(item.query);
            }
            if (!_.isEmpty(item.queryDesc)) {
                item.queryDesc = _parse(item.queryDesc, ['', ''], '\r\n');
            }

            if (!_.isEmpty(item.body)) {
                item.body = _parse(item.body);
            }
            if (!_.isEmpty(item.bodyComment)) {
                item.bodyComment = _parse(item.bodyComment, ['', ''], '\r\n');
            }

            if (!_.isEmpty(item.res)) {
                item.res = _parse(item.res);
            }
            if (!_.isEmpty(item.resComment)) {
                item.resComment = _parse(item.resComment, ['', ''], '\r\n');
            }

            return item;
        });
    }

    function _parse(obj, wrap, split) {
        if (_.isString(obj)) {
            return obj;
        }

        var list = [];
        wrap = wrap || ['{', '}'];
        split = split || ', ';

        if (_.isArray(obj)) {
            return '[' + _.map(obj, function (item) {
                    if (_.isObject(item)) {
                        return _parse(item);
                    }

                    return item;
                }).join(', ') + ']';
        }

        _.each(obj, function (value, key) {
            if (_.isObject(value)) {
                list.push([key, _parse(value)].join(': '));
                return;
            }

            list.push([key, value].join(': '));
        });

        return [wrap[0], list.join(split), wrap[1]].join('');
    }
}

function configPath() {
    var args = parseArg();

    if (_.isEmpty(args.config)) {
        throw new Error('use -c appoint config path.');
    }

    return args.config;
}

function parseArg() {
    var result = {};
    var parseRule = {
        '-c': 'config'
    };

    var arg = process.argv;
    _.each(arg, function (item, index) {
        if (!_.includes(item, '-') || _.isEmpty(parseRule[item])) {
            return;
        }

        result[parseRule[item]] = arg[index + 1];
    });

    return result;
}

function template() {
    return '## <%= name %>\r\n' +
        '<% if(typeof comment !== "undefined") { %>' +
        '* `comment`: <%= comment %>\r\n' +
        '<% } %>' +

        '* `url`: <%= path %>\r\n' +
        '* `method`: <%= method %>\r\n' +

        '<% if(typeof query !== "undefined") { %>' +
        '* `query`: <%= query %>\r\n' +
        '<% } %>' +

        '<% if(typeof queryDesc !== "undefined") { %>' +
        '```\r\n' +
        '<%= queryDesc %>\r\n' +
        '```\r\n' +
        '<% } %>' +

        '<% if(typeof body !== "undefined") { %>' +
        '* `body`: <%= body %>\r\n' +
        '<% } %>' +

        '<% if(typeof bodyComment !== "undefined") { %>' +
        '```\r\n' +
        '<%= bodyComment %>\r\n' +
        '```\r\n' +
        '<% } %>' +

        '<% if(typeof res !== "undefined") { %>' +
        '* `res`: <%= res %>\r\n' +
        '<% } %>' +

        '<% if(typeof resComment !== "undefined") { %>' +
        '```\r\n' +
        '<%= resComment %>\r\n' +
        '```\r\n' +
        '<% } %>';
}