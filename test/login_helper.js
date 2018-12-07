process.env.NODE_ENV = 'test';

var chai = require('chai');
var server = require('../index');

// Container
var helpers = {};

// login
helpers.login = function(resolve) {
  chai
    .request(server)
    .post('/api/v1/signin')
    .set('Accept', 'application/json')
    .send({ email: 'quibstar@gmail.com', password: 'p' })
    .end(function(err, res) {
      token = res.body.token;
      resolve(token);
    });
};

module.exports = helpers;
