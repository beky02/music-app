var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    sex: {
        required: true,
        type: String,
        enum: ["M","F"]
    },
    dateOfBirth: {
        required: true,
        type: Date
    },
    phone: {
        required: true,
        type: Number,
        minlength: 10,
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
    addedBy: {
        required: true,
        type: mongoose.Types.ObjectId,
    }
    // timestamps: true
});

module.exports = mongoose.model('Admin', Admin);