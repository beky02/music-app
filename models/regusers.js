var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Regusers = new Schema({
  
    mobile: {
        type: Number,
        required: true,
        min: 11,
        unique: true
    },
    subcriptions:{
        type: [String],
        required: true,
        default: ["1"],
        enum: ["1","2","3","5","6","A1","A2","A3","J","N"]
    },
   regDate:{
       type: Date,
       required: true
   },
   regTime:{
    type: Date,
    required: true
}

});

module.exports = mongoose.model('Regusers',Regusers);