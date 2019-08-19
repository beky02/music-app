var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Status = new Schema({
    status:{
        type: String,
        required: true,
        enum: ["YES","NO"]
    },
    date:{
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("Status",Status);
