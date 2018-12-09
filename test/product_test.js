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
const Project = require('../models/project');
const Account = require('../models/account');

describe.only('project Test: ', function() {
  var testProject;
  var testProduct;
  before(done => {
    Account.findOne({ name: 'test' }).then(account => {
      var p = new Project({
        name: 'test',
        description: 'test description',
        accountId: account._id,
      });

      p.save()
        .then(p => {
          testProject = p;
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

  // /**
  //  * index
  //  */
  // it('Show: projects', function(done) {
  //   chai
  //     .request(server)
  //     .get('/api/v1/projects')
  //     .send({ id: testProject._id })
  //     .set('Authorization', token)
  //     .end(function(err, res) {
  //       res.should.have.status(200);
  //       done();
  //     });
  // });

  // it('GET: should return 200 ', function(done) {
  //   chai
  //     .request(server)
  //     .get('/api/v1/projects/' + testProject._id)
  //     .set('Accept', 'application/json')
  //     .set('Authorization', token)
  //     .end(function(err, res) {
  //       res.body.should.be.a('object');
  //       res.should.have.status(200);
  //       done();
  //     });
  // });

  it('CREATE: A new project product', function(done) {
    chai
      .request(server)
      .post('/api/v1/project-product')
      .send({
        projectId: testProject._id,
        name: 'Sander',
        quantity: 1,
        price: 50.0,
        unit: 'ea.',
        total: 50.0,
      })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        testProduct = res.body.project.products[0];
        assert(res.body.project.products[0].name === 'Sander', 'Should be Sander');
        done();
      });
  });

  it('EDIT: project', function(done) {
    testProduct.name = 'Updated name';
    testProduct.projectId = testProject._id;
    chai
      .request(server)
      .put('/api/v1/project-product/' + testProject._id)
      .send(testProduct)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  // delete at the end
  it('Delete: project', function(done) {
    let id = testProject._id + '==' + testProduct._id;
    console.log(id);
    chai
      .request(server)
      .delete('/api/v1/product-delete/' + id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        assert(res.body.project.products.length === 0, 'product should be empty');
        done();
      });
  });
});
