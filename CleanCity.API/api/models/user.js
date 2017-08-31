// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    organization: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    passwordConf: {
        type: String,
        required: true
    }
});


UserSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
        bcrypt.hash(user.passwordConf, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.passwordConf = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
