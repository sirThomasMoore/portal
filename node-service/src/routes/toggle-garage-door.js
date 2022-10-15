var express = require('express');
var router = express.Router();
var RequiresLogin = require('../middleware/requires-login');
var request = require('request');

// POST /toggleGarageDoor
router.post('/toggle-garage-door', RequiresLogin, function (req, res, next) {
  let pythonUrl = 'http://python-service:5000/toggle-garage-door';

  request.get(pythonUrl, function (pyErr, pyRes, pyBody) {
    if (!pyErr && pyRes.statusCode === 200) {
      res.status(200).send(pyRes.body);
    }
  });

});

router.get('/garage-door-status', RequiresLogin, function (req, res, next) {
  let pythonUrl = 'http://python-service:5000/garage-door-status';

  request.get(pythonUrl, function (pyErr, pyRes, pyBody) {
    if (!pyErr && pyRes.statusCode === 200) {
      res.status(200).send(pyRes.body);
    }
  });

});

module.exports = router;
