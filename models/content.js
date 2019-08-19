var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Content = new Schema({
   keyword:{
       type: String,
       required: true,
       enum: ["1","2","3","5","6","A1","A2","A3","J","N"]
   },
   content:{
    type: String,
    required: true,
    default: "",
    
   },
   savedTime:{
       type: Date,
       required: true
   },
   savedDate:{
    type: Date,
    required: true
}

});

module.exports = mongoose.model('Content',Content);