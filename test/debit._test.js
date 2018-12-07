process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
chai.should();
var assert = require('assert');

chai.use(chaiHttp);

// login helper
var loginHelper = require('./login_helper');
var token = '';
const Debt = require('../models/debt');

describe('Debt Test: ', function() {
  var testDebt;
  before(done => {
    var debt = new Debt({
      name: 'Amazon',
      category: 'Credit Card',
      amount: '1200.01',
      accountNumber: '123456789',
    });
    debt.save(function(err) {
      Debt.findOne({ name: 'Amazon' }).then(debt => {
        testDebt = debt;
        done();
      });
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

  it('GET: should return 200 ', function(done) {
    chai
      .request(server)
      .get('/api/v1/debts/' + testDebt._id)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });

  it('CREATE: A new debt', function(done) {
    chai
      .request(server)
      .post('/api/v1/debts')
      .send({
        name: 'Car Payment',
        category: 'Loan',
        amount: '1200.01',
        accountNumber: '123456789',
      })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('EDIT: debt', function(done) {
    testDebt.name = 'Update debt';
    chai
      .request(server)
      .put('/api/v1/debts/' + testDebt._id)
      .send(testDebt)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('Show: debt', function(done) {
    chai
      .request(server)
      .get('/api/v1/debts')
      .send({ id: testDebt._id })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('Delete: debt', function(done) {
    chai
      .request(server)
      .delete('/api/v1/debts/' + testDebt._id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        Debt.findOne({ id: testDebt._id }).then(debt => {
          assert(debt === null, 'debt should be null');
          done();
        });
      });
  });
});
