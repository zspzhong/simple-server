var mongoose = require('mongoose');

var HelloWorldSchema = new mongoose.Schema({
    text: {type: String}
});

mongoose.model('hello_world', HelloWorldSchema);