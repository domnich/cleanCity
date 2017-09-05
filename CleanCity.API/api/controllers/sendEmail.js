'use strict';
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var config = require('../../config');

exports.sendMail = function (req, res) {
    if (req.headers && req.headers['x-access-token']) {
        var authorization = req.headers['x-access-token'],
            user;
        try {
            user = jwt.verify(authorization, config.secret)._doc;
        } catch (e) {
            return res.status(401).send('unauthorized');
        }

        delete user.password;
        delete user._id;
        delete user.passwordConf;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            auth: {
                user: 'xxxxxxxxxxxxxxx',
                pass: 'xxxxxxxxxxxxxxx'
            },
            port: 587,
            secure: false, // use SSL

            tls: {
                rejectUnauthorized: false
            }
        });

        var name = user.username,
            mail = user.email,
            address = user.city + '  ' + user.street,
        text = `
        Заявка от пользователя ${name} принята
        Почта: ${mail},
        Адрес:  ${address},
        Телефон: пока пусто`;

        var mailOptions = {
            from: 'domnich.ivan@gmail.com',
            to: 'prosmoky@gmail.com',
            subject: 'Чистая планета',
            text: text
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

    }

};

