var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageIn = new Schema({
   messageFrom: {
       type: Number,
       required: true,
       min:10,
       unique: true
   },
   messageTo: {
    type: Number,
    required: true,
    min:10,
    unique: true
   },
   messageText:{
    type: String,
    required: true,
    default: ""
   },
   RecievedTime:{
       type: Date,
       required: true
   }

});

module.exports = mongoose.model('MessageIn',MessageIn);