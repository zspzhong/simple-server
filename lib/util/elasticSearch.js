var es = require('elasticsearch');
var client = new es.Client({
    host: global.esOptions.host + ':' + global.esOptions.port
});

module.exports = client;