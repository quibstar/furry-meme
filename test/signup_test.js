process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Sign up API', function() {
  it('Should 422 if account is empty', function(done) {
    chai
      .request(server)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({ email: 'quibstar@gmail', password: 'p' })
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.body.error.should.equal('You must provide an account, name, email and password');
        res.should.have.status(422);
        done();
      });
  });

  it('Should reject if account is in use', function(done) {
    chai
      .request(server)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({
        email: 'quibstar@gmail',
        name: 'Test User',
        password: 'p',
        account: 'test',
      })
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.body.error.should.equal('Account already taken.');
        res.should.have.status(422);
        done();
      });
  });

  it('Should be a successful sign in', function(done) {
    chai
      .request(server)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({
        email: 'kris@vianet.us',
        name: 'kris utter',
        password: 'passwordIsValid@1',
        account: 'Vianet123',
      })
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});
