require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
var config = require('./db/config');

mongoose.connect(
  config.mongoURI[app.settings.env],
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  },
  function(err, res) {
    if (err) {
      console.log('Error connecting to the database. ' + err);
    } else {
      if (app.settings.env !== 'production') {
        console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
      }
    }
  }
);

mongoose.Promise = global.Promise;

// App Setup
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  var path = require('path');
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Server Setup
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Serve listening on: ', port);

// testing
if (app.settings.env === 'test') {
  const server = http.createServer(app);
  module.exports = server;
}
