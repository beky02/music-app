var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeleteUsers = new Schema({
    mobile_Number: {
        type: Number,
        required: true,
        min: 10,
        unique: true
    }
});

module.exports = mongoose.model('DeleteUsers',DeleteUsers);