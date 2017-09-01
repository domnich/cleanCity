var BlackList = require('../models/blacklist');


exports.addToBlackList = function(req, res) {
    var blackList = new BlackList({
        token: req.body.token
    });

    BlackList.find({}).exec(function(err, docs) {
        if (err.length){
            return res.status(403).send({
                success: false,
                message: 'User Already Exist.'
            });
        } else {
            blackList.save(function(err, response) {
                if (err)
                    res.send(err);

                res.json({ success: true });
            });
        }
    });
};