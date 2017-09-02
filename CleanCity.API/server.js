var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('express-cors');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./api/models/user');
var userController = require('./api/controllers/user');
var sendMailContoller = require('./api/controllers/sendEmail');
var todoList = require('./api/controllers/todoListController');
var bcrypt = require('bcrypt-nodejs');
var port = process.env.PORT || 8080;
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true});
app.set('superSecret', config.secret); // secret variable

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Headers","Access-Control-Allow-Headers");
//
// });
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
//     next();
// });

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


// app.use(cors({
//     allowedOrigins: [
//         'http://localhost:8100'
//     ]
// }));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin');
//     next();
// });


app.use(cors({
    allowedOrigins: ['http://localhost:8100'],
    headers: ['X-Requested-With', 'Accept', 'Origin', 'x-access-token', 'Content-Type']
}));
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.post('/signup', userController.createUser);

var apiRoutes = express.Router();

apiRoutes.post('/login', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) throw err;

        if (!user) {

            return res.status(401).send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 60 * 60 * 24 //expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        status: 200,
                        message: 'Enjoy your token!',
                        user: user,
                        token: token
                    });
                }

            });
        }
    });
});

apiRoutes.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

apiRoutes.get('/send', sendMailContoller.sendMail);

apiRoutes.get('/', function (req, res) {
    res.json({message: 'Welcome to the coolest API on earth!'});
});

apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});
app.use('/api', apiRoutes);
app.listen(port);
console.log('Magic happens at http://localhost:' + port);