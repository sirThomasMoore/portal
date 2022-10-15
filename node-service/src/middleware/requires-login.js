const jwtHandler = require('../middleware/jwt-handler');

function requiresLogin(req, res, next) {
	let token = '';
	if (req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1];
	}
	const tokenVerified = jwtHandler.verifyToken(req, res, next, token);
	if (!token || !tokenVerified) {
		const error = new Error('You must be logged in.');
		error.status = 401;
		return next(error);
	}

	return next();

}

module.exports = requiresLogin;