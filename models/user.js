var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let User = new Schema(
    {
        firstname: {
            required: true,
            type: String,
        },
        lastname: {
            required: true,
            type: String,
        },
        sex: {
            required: true,
            type: String,
            enum: ["M", "F"]
        },
        dateOfBirth: {
            required: true,
            type: String
        },
        phone: {
            required: true,
            type: Number,
            minLength: 10,
            unique: true
        },
        password: {
            required: true,
            type: String,
            minlength: 6
        },
        email: {
            required: false,
            type: String,
            default: "",
            unique: true
        },
        tokens: Array,
        passwordResetExpires: {
            required: false,
            type: String,
            minlength: 6
        },
        passwordResetToken: {
            required: false,
            type: String,
            minlength: 6
        },
        addedBy:{
            required:true,
            type: mongoose.Types.ObjectId
            
        }
        // timestamps: true
    }
);

module.exports = mongoose.model('User',User);
