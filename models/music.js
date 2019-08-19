var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Music = new Schema({
    title: {
        type: String,
        require: true,
        defualt: ""
    },
    arthist: {
        type: String,
        require: true,
        defualt: ""
    },
    path: {
        type: String,
        require: true,
        defualt: ""
    },
    timeStamp: {
        type: Date,
        require: true,
        defualt: Date.now
    }

});

module.exports = mongoose.model('Music', Music);