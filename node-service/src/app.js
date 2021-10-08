const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config.json');
const routes = [
  require('./routes/login'),
  require('./routes/register'),
  require('./routes/toggle-garage-door')
];
const corsOptions = {
  origin: (origin, callback) => {
    const isWhitelisted = config.originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  }
};
const APP = express();

// create mongodb connection
mongoose.connect('mongodb://mongo:27017/portal', { useNewUrlParser: true});

const db = mongoose.connection;

//add cors whitelist
APP.use(cors(corsOptions));

// parse incoming requests
APP.use(bodyParser.json());
APP.use(bodyParser.urlencoded({ extended: false }));

// 4. Force https in production
if (APP.get('env') === 'production') {
  APP.use(function (req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

// include routes
routes.forEach(route => {
  APP.use('/api', route);
});

// catch 404 and forward to error handler
APP.use((req, res, next) => {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last APP.use callback
APP.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// listen on port 3000
APP.listen(config.port, function() {
  console.log(`Express APP listening on port: ${config.port}`);
});
