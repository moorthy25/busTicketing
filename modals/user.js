//to get user details like name and mobile number
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('user', user);