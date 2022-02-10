var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rout = new Schema({
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    amt: {
        type: String,
        required: true
    },
    orderId: {
        type: String
    },
    success: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('payment', rout);