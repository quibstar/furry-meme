process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Login API', function() {
  describe('invalid login attempt', function() {
    it('Should 401 if credential is invalid', function(done) {
      chai
        .request(server)
        .post('/api/v1/signin')
        .set('Accept', 'application/json')
        .send({ email: 'some@email.com', password: 'p' })
        .end(function(err, res) {
          res.body.should.be.a('object');
          res.should.have.status(401);
          done();
        });
    });

    it('Should 200 if credential are valid', function(done) {
      chai
        .request(server)
        .post('/api/v1/signin')
        .set('Accept', 'application/json')
        .send({ email: 'quibstar@gmail.com', password: 'p' })
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});
