const jwt = require('jsonwebtoken');
const config = require('../config.json');

const createToken = (req, res, next, user) => {
  const payload = {
    email: user.email,
    name: user.name,
    role: user.role
  }
  const token = jwt.sign({ user: user.email }, config.jwtKey, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpirySeconds
  })
  const decoded = jwt.verify(token, config.jwtKey);
  return res.json({ user: payload, jwt: token, expirationCountdown: config.jwtExpirySeconds * 1000, expiration: decoded.exp });
}

const verifyToken = (req, res, next, token) => {
  let isVerified = false;
  try {
    if (jwt.verify(token, config.jwtKey)) {
      isVerified = true;
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return isVerified;
    }
    return isVerified;
  }
  return isVerified;
}

module.exports.createToken = createToken;
module.exports.verifyToken = verifyToken;
