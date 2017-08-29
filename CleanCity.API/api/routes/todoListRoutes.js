/**
 * Created by ivan on 18.08.2017.
 */
'use strict';
module.exports = function(app) {
    var todoList = require('../controllers/todoListController');
    var userController = require('../controllers/user');
    var authController = require('../controllers/auth');


    // todoList Routes
    app.route('/tasks')
        .get(authController.isAuthenticated, todoList.list_all_tasks)
        .post(authController.isAuthenticated, todoList.create_a_task);


    app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);


    app.route('/users')
        .post(userController.postUsers)
        .get(authController.isAuthenticated, userController.getUsers);
};