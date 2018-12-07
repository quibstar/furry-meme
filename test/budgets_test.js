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
const Budget = require('../models/budget');
const Payment = require('../models/payment');

describe('Budget Test: ', function() {
  var testBudget;
  before(done => {
    Budget.findOne({ name: 'August Budget' })
      .populate('payments')
      .then(budget => {
        testBudget = budget;
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

  it('GET: should return 200 ', function(done) {
    chai
      .request(server)
      .get('/api/v1/budgets/' + testBudget._id)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });

  it('CREATE: A new budget', function(done) {
    chai
      .request(server)
      .post('/api/v1/budgets')
      .send({
        name: 'August Budget',
        category: 'home',
        amount: '123',
        payments: [
          new Payment({
            name: 'Car Payment',
            amount: 135.42,
            paid: false,
            note: 'Paid this off early to get some more money in savings',
          }),
        ],
      })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('EDIT: budget', function(done) {
    testBudget.name = 'Update budget';
    testBudget.payments[0].name = 'updated too';
    testBudget.payments.push(
      new Payment({
        name: 'Car Payment3',
        amount: 135.42,
        paid: false,
        note: 'Paid this off early to get some more money in savings',
      })
    );
    chai
      .request(server)
      .put('/api/v1/budgets/' + testBudget._id)
      .send(testBudget)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('Show: budget', function(done) {
    chai
      .request(server)
      .get('/api/v1/budgets')
      .send({ id: testBudget._id })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  // delete at the end
  it('Delete: budget', function(done) {
    chai
      .request(server)
      .delete('/api/v1/budgets/' + testBudget._id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        Budget.findOne({ id: testBudget._id }).then(budget => {
          assert(budget === null, 'budget should be null');
          done();
        });
      });
  });
});
