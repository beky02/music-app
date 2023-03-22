var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscrubeMessageOut = new Schema({
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
    default: "Welcome to \'6096\' service you will receive 6SMS/week. 1ETB/SMS to subscrube Send (1) For AMHARIC Sport News (1) For AMHARIC Jokes (3) For Do YOU Know (4) For Beauty (5) For OROMO Jokes (6) for OROMO Sport to \'6008\' For free ለአማረኛ \'እሽ\' ብለው በነጻ \'6096\' ይላኩ"
   },
   isSent:{
       type: Number,
       required: true,
       default:0
   }

});

module.exports = mongoose.model('SubscrubeMessageOut',SubscrubeMessageOut);
