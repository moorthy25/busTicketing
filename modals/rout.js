var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rout = new Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('route', rout);