var es = require('elasticsearch');
var client = new es.Client({
    host: 'docker:9200'
});

module.exports = client;