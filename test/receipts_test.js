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
const Receipt = require('../models/receipt');
const Account = require('../models/account');

// TODO: REMOVE .only from below
describe.only('receipt Test: ', function() {
  var testReceipt;
  before(done => {
    Account.findOne({ name: 'test' }).then(account => {
      var p = new Receipt({
        amount: 200.99,
        business: 'Home depot',
        purchaseDate: Date.now(),
        category: 'Home',
        accountId: account._id,
      });

      p.save()
        .then(p => {
          testReceipt = p;
          done();
        })
        .catch(e => {
          console.log(e.message);
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

  /**
   * index
   */
  it('Show: receipts', function(done) {
    chai
      .request(server)
      .get('/api/v1/receipts')
      .send({ id: testReceipt._id })
      .set('Authorization', token)
      .end(function(err, res) {
        assert(res.body.receipts.length == 1, 'Should have one receipt');
        res.should.have.status(200);
        done();
      });
  });

  it('GET: should return 200 ', function(done) {
    chai
      .request(server)
      .get('/api/v1/receipts/' + testReceipt._id)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        assert(res.body.receipt.amount === 200.99, 'Should equal 200.99');
        res.should.have.status(200);
        done();
      });
  });

  it('CREATE: A new receipt', function(done) {
    chai
      .request(server)
      .post('/api/v1/receipts')
      .send({
        amount: 10.99,
        business: 'Meijer',
        purchaseDate: Date.now(),
        category: 'Groceries',
      })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        assert(res.body.receipt.amount === 10.99, 'Should equal 10.99');
        assert(res.body.receipt.category === 'Groceries', 'Category should be Groceries');
        done();
      });
  });

  it('EDIT: receipt', function(done) {
    testReceipt.category = 'Test';
    chai
      .request(server)
      .put('/api/v1/receipts/' + testReceipt._id)
      .send(testReceipt)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        assert(res.body.receipt.category === 'Test', 'Category should be Test');
        done();
      });
  });

  // delete at the end
  it('Delete: receipt', function(done) {
    chai
      .request(server)
      .delete('/api/v1/receipts/' + testReceipt._id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        Receipt.findOne({ id: testReceipt._id }).then(receipt => {
          assert(receipt === null, 'receipt should be null');
          done();
        });
      });
  });
});
