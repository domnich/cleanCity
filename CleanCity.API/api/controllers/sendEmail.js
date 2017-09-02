'use strict';
const nodemailer = require('nodemailer');

exports.sendMail = function (req, res) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: 'test@test.com',
            pass: 'qwerty'
        },
        port: 587,
        secure: false, // use SSL

        tls: {
            rejectUnauthorized: false
        }
    });


    var mailOptions = {
        from: 'domnich.ivan@gmail.com',
        to: 'prosmoky@gmail.com',
        subject: 'Чистая планета',
        text: 'Заявка от такого то такого то принята'
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.status(401).send({
                success: false,
                message: 'Something went wrong during sending'
            });
        } else {
            res.json({
                success: true,
                message: info.response
            });
            transport.close();
        }
    });
};

