process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
chai.should();

chai.use(chaiHttp);
const Account = require('../models/account');

// login helper
var loginHelper = require('./login_helper');
var token = '';

describe('Account test', function() {
  var testAccount;
  before(done => {
    Account.findOne({ name: 'test' }).then(account => {
      testAccount = account;
      done();
    });
  });

  beforeEach(done => {
    var promise = new Promise(function(resolve, reject) {
      loginHelper.login(resolve);
    });
    promise.then(function(result) {
      token = result;
      done();
    });
  });

  it('GET: Account ', function(done) {
    chai
      .request(server)
      .get('/api/v1/account')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });

  it('GET: Account categories', function(done) {
    chai
      .request(server)
      .get('/api/v1/categories')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('array');
        res.should.have.status(200);
        done();
      });
  });

  it('PUT: Account update categories', function(done) {
    var cats = testAccount.categories[0];
    // testAccount.categories[0].categories.push('test');

    cats.categories.push('test');

    chai
      .request(server)
      .put('/api/v1/categories/' + cats._id)
      .send(cats)
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});
