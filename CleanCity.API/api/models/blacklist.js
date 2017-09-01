var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('BlackList', BlackListSchema);
