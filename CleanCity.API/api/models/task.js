var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
    name: String,
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    }
});

module.exports = mongoose.model('User', UserSchema);