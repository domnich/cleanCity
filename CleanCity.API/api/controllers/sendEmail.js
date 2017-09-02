'use strict';
const nodemailer = require('nodemailer');

exports.sendMail = function () {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'domnich.ivan@gmail.com',
            pass: 'ker4comua'
        }
    });

    var mailOptions = {
        from: 'domnich.ivan@gmail.com',
        to: 'prosmoky@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

