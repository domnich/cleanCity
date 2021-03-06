// // Load required packages
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');
var express     = require('express');
var app         = express();
var config = require('../../config');
// Create endpoint /api/users for POST
exports.createUser = function(req, res) {
    var user = new User({
        email: req.body.email,
        username: req.body.username,
        organization: req.body.organization,
        city: req.body.city,
        street: req.body.street,
        password: req.body.password,
        passwordConf: req.body.passwordConf
    });

    if(!user.email || !user.username || !user.password || !user.passwordConf) {
        return res.status(403).send({
            success: false,
            message: 'Fill all required fields'
        });
    } else {
        User.find({email : user.email}).exec(function(err, docs) {
            if (docs.length){
                return res.status(403).send({
                    success: false,
                    message: 'User Already Exist.'
                });
            } else {

                User.verifyPassword(user.password, user.passwordConf, function (isMatch) {
                    if(isMatch) {
                        user.save(function(err, user) {
                            if (err)
                                res.send(err);

                            delete user.password;
                            delete user.passwordConf;

                            res.json({ success: true, user: user });
                        });
                    } else {
                        return res.status(403).send({
                            success: false,
                            message: "Passwords doesn't math."
                        });
                    }
                });
            }
        });
    }
};


exports.updateUser = function (req, res) {

    User.findOne({
        _id: req.params.id
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'User not found.'
            });
        } else if (user) {

            if(req.body.oldPassword) {
                bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch) {
                    if(isMatch) {

                        User.verifyPassword(req.body.password, req.body.passwordConf, function (passwordsMatch) {
                            if(passwordsMatch) {

                                bcrypt.genSalt(5, function(err, salt) {
                                    if (err) {
                                        return res.status(401).send({
                                            success: false,
                                            message: 'Something went wrong.'
                                        });
                                    }

                                    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                                        if (err) {
                                            return res.status(401).send({
                                                success: false,
                                                message: 'Something went wrong.'
                                            });
                                        }

                                        var userObj = req.body;
                                        delete userObj.oldPassword;
                                        userObj.password = hash;
                                        userObj.passwordConf = hash;

                                        User.findOneAndUpdate({_id: req.params.id}, userObj, {new: true}, function(err, user) {
                                            if (err)
                                                return res.status(401).send({
                                                    success: false,
                                                    message: err.message
                                                });


                                            var token = jwt.sign(user, config.secret, {
                                                expiresIn : 60*60*24 //expires in 24 hours
                                            });

                                            res.json({
                                                success: true,
                                                message: 'User was updated',
                                                user: user,
                                                token: token
                                            });

                                        });

                                    });
                                });

                            } else {
                                return res.status(403).send({
                                    success: false,
                                    message: "Passwords doesn't math."
                                });
                            }
                        });


                    } else {
                        return res.status(401).send({
                            success: false,
                            message: 'You have entered wrong password.'
                        });
                    }
                });
            } else {
                delete req.body.password;
                delete req.body.passwordConf;

                User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user) {
                    if (err)
                        return res.status(401).send({
                            success: false,
                            message: err.message
                        });

                    res.json({
                        success: true,
                        message: 'User was updated',
                        user: user
                    });
                });
            }
        }

    });
};

exports.login = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {

            return res.status(401).send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn : 60*60*24 //expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            });
        }

    });
}

//
// // Create endpoint /api/users for GET
// exports.getUsers = function(req, res) {
//     User.find(function(err, users) {
//         if (err)
//             res.send(err);
//
//         res.json(users);
//     });
// };