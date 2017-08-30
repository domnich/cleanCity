// /**
//  * Created by ivan on 18.08.2017.
//  */
// 'use strict';
// module.exports = function(app) {
//     var todoList = require('../controllers/todoListController');
//     var userController = require('../controllers/user');
//     var authController = require('../controllers/auth');
//     var clientController = require('../controllers/client');
//     var oauth2Controller = require('../controllers/oauth2');
//
//
//     // todoList Routes
//     app.route('/tasks')
//         .get(authController.isAuthenticated, todoList.list_all_tasks)
//         .post(authController.isAuthenticated, todoList.create_a_task);
//
//
//     app.route('/tasks/:taskId')
//         .get(todoList.read_a_task)
//         .put(todoList.update_a_task)
//         .delete(todoList.delete_a_task);
//
//
//     app.route('/users')
//         .post(userController.postUsers)
//         .get(authController.isAuthenticated, userController.getUsers);
//
//     app.route('/clients')
//         .post(authController.isAuthenticated, clientController.postClients)
//         .get(authController.isAuthenticated, clientController.getClients);
//
//
//     // Create endpoint handlers for oauth2 authorize
//     app.route('/oauth2/authorize')
//         .get(authController.isAuthenticated, oauth2Controller.authorization)
//         .post(authController.isAuthenticated, oauth2Controller.decision);
//
//     // Create endpoint handlers for oauth2 token
//     app.route('/oauth2/token')
//         .post(authController.isClientAuthenticated, oauth2Controller.token);
//
//
//
// };