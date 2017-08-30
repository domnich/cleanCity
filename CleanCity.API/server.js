/**
 * Created by ivan on 18.08.2017.
 */
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/todoListModel'), //created model loading here
    bodyParser = require('body-parser');

var passport = require('passport');
var ejs = require('ejs');
var session = require('express-session');


app.set('views','./api/views');

app.set('view engine', 'ejs');


// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cleanCity', {useMongoClient: true});





app.use(bodyParser.urlencoded({ extended: true }));
// Use express session support since OAuth2orize requires it
app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());

app.use(bodyParser.json());
// Add headers
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

// var routes = require('./api/routes/appRoutes'); //importing route
// app.use('/api', routes);
//
// routes(app); //register the route


var todoList = require('./api/controllers/todoListController');
var userController = require('./api/controllers/user');
var authController = require('./api/controllers/auth');
var clientController = require('./api/controllers/client');
var oauth2Controller = require('./api/controllers/oauth2');

var router = express.Router();
// todoList Routes
router.route('/tasks')
    .get(authController.isAuthenticated, todoList.list_all_tasks)
    .post(authController.isAuthenticated, todoList.create_a_task);


router.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);


router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);


// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);


app.use('/api', router);
app.listen(port);


console.log('todo list RESTful API server started on: ' + port);