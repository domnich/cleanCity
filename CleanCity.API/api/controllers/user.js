// // Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.createUser = function(req, res) {
    var user = new User({
        email: req.body.email,
        username: req.body.username,
        organization: req.body.organization,
        password: req.body.password,
        passwordConf: req.body.passwordConf
    });

    user.save(function(err, user) {
        if (err)
            res.send(err);

        res.json({ success: true, user: user });
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