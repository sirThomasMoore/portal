const express = require('express');
const router = express.Router();
const jwtHandler = require('../middleware/jwt-handler');
const User = require('../models/user');

// POST /register
router.post('/register', (req, res, next) => {

    User.find().exec((error, data) => {
        var userData = {
            email: '',
            name: '',
            password: '',
            role: ''
        };
        if (req.body.email &&
            req.body.name &&
            req.body.password &&
            req.body.confirmPassword) {

            // confirm that user typed same password twice
            if (req.body.password !== req.body.confirmPassword) {
                var err = new Error('Passwords do not match.');
                err.status = 400;
                return next(err);
            }

            // create object with form input
            userData.email = req.body.email;
            userData.name = req.body.name;
            userData.password = req.body.password;
            if (!data.length) {
                userData.role = 'admin';
            } else {
                userData.role = 'user';
            }

            // user schema's `create` method to insert document into Mongo
            User.create(userData, (error, user) => {
                if (error) {
                    return next(error);
                } else {
                    return jwtHandler.createToken(req, res, next, user);
                }
            });

        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }

    });
});

router.get('/has-users', (req, res, next) => {
    User.find({}, (err, users) => {
        if (!users.length) {
            return res.send({hasUsers: false});
        }
        return res.send({hasUsers: true});
    });
});

module.exports = router;
