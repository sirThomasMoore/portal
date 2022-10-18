const express = require('express');
const bcrypt = require('bcrypt');
const requiresLogin = require('../middleware/requires-login');
const router = express.Router();
const User = require('../models/user');

router.post('/update-user', requiresLogin, (req, res, next) => {
	try {
		if (!req.body.email || !req.body.newPassword || !req.body.confirmNewPassword) {
			const error = new error('All fields required.');
			error.status = 400;
			return next(error);
		}
		const email = req.body.email.trim();
		const newPassword = req.body.newPassword.trim();
		const confirmNewPassword = req.body.confirmNewPassword.trim();

		if (newPassword === confirmNewPassword) {
			bcrypt.hash(newPassword, 10, function (err, hash) {
				if (err) {
					return next(err);
				}
				User.findOneAndUpdate({ email }, { password: hash }, (error, user) => {
					if (error) {
						return next(error);
					} else {
						return res.status(200).end();
					}
				})
			});
		} else {
			const error = new Error('All fields required.');
			error.status = 400;
			return next(error);
		}

	} catch (error) {
		return next(error)
	}
});

module.exports = router;
