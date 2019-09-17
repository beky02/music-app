var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageOut = new Schema({
   messageTo: {
       type: Number,
       required: true,
       min:10,
   },
   messageFrom: {
    type: Number,
    required: true,
    min:4,
   },
   messageText:{
    type: String,
    required: true,
   },
   isSent:{
       type: Number,
       required: true,
       default:0
   }

});

module.exports = mongoose.model('MessageOut',MessageOut);