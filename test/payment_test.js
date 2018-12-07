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
const Payment = require('../models/payment');
const Debt = require('../models/debt');

describe('Payment Test: ', function() {
  var testDebt;
  before(done => {
    payment = new Payment({
      // debtId: debt,
      note: 'Test payment',
      amount: '500',
      createdAt: Date.now(),
    });

    var debt = new Debt({
      name: 'Amazon',
      category: 'Credit Card',
      amount: '1200.01',
      accountNumber: '123456789',
      payments: [payment],
    });
    debt.payments.push(payment);
    debt.save(function(err, d) {
      testDebt = d;
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

  it('CREATE: A new payment', function(done) {
    payment = {
      debtId: testDebt._id,
      note: 'Test payment',
      amount: '500',
      createdAt: Date.now(),
    };

    chai
      .request(server)
      .post('/api/v1/payments/')
      .send(payment)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('EDIT: payment', function(done) {
    var payment = testDebt.payments[0];
    payment.amount = 1;
    payment.paidOn = Date.now();
    chai
      .request(server)
      .put('/api/v1/payments/' + payment._id)
      .send(payment)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        // console.log('edit', res.body.payment, err);
        // assert(res.body.payment.amount === 1, true);
        done();
      });
  });

  it('Delete: payment', function(done) {
    var payment = testDebt.payments[0];
    chai
      .request(server)
      .delete('/api/v1/payments/' + payment._id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        assert(res.body.payments === undefined, true);
        done();
      });
  });
});
