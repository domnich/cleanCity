// // Load required packages
var User = require('../models/user');

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


};
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