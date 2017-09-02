// /**
//  * Created by ivan on 18.08.2017.
//  */
// 'use strict';
//
//
// var mongoose = require('mongoose'),
//     Task = mongoose.model('Tasks');
//
// exports.list_all_tasks = function(req, res) {
//     // Task.find({ userId: req.user._id }, function(err, task) {
//     //     if (err)
//     //         res.send(err);
//     //     res.json(task);
//     // });
//
//     Task.find({ }, function(err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
//
//
//
//
// exports.create_a_task = function(req, res) {
//     var new_task = new Task();
//     new_task.name = req.body.name;
// //    new_task.userId = req.user._id;
// //{name : new_task.name}
//     Task.find({}).exec(function(err, docs) {
//         console.log(err)
//         console.log(docs)
//
//         if (docs.length){
//             res.json({ message: 'Task already exists' });
//         } else {
//             new_task.save(function(err, task) {
//                 if (err)
//                     res.send(err);
//                 res.json(task);
//             });
//         }
//     });
// };
//
//
// exports.read_a_task = function(req, res) {
//     Task.findById(req.params.taskId, function(err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
//
//
// exports.update_a_task = function(req, res) {
//     Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
//
//
// exports.delete_a_task = function(req, res) {
//
//
//     Task.remove({
//         _id: req.params.taskId
//     }, function(err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };