const express = require('express');
const jwtHandler = require('../middleware/jwt-handler');
const router = express.Router();
const User = require('../models/user');

router.get('/ping', (req, res, next) => {
  res.status(200).json({
    success: true
  });
});

// POST /login
router.post('/login', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        return res.status(401).json({
          error: error
        });
      } else {
        const payload = {
          email: user.email,
          name: user.name,
          role: user.role
        }

        return jwtHandler.createToken(req, res, next, payload);
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// POST /refresh-token
router.post('/refresh-token', (req, res, next) => {
  const token = req.body.jwt;
  const payload = {
    email: req.body.user.email,
    name: req.body.user.name,
    role: req.body.user.role
  }

  if (!token || !payload.email && !payload.name && !payload.role) {
    return res.status(400).end();
  }

  if (!jwtHandler.verifyToken(req, res, next, token)) {
    return res.status(401).end();
  }

  return jwtHandler.createToken(req, res, next, payload);

});

module.exports = router;
