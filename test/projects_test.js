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

describe('project Test: ', function() {
  var testProject;
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

  /**
   * index
   */
  it('Show: projects', function(done) {
    chai
      .request(server)
      .get('/api/v1/projects')
      .send({ id: testProject._id })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('GET: should return 200 ', function(done) {
    chai
      .request(server)
      .get('/api/v1/projects/' + testProject._id)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end(function(err, res) {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });

  it('CREATE: A new project', function(done) {
    chai
      .request(server)
      .post('/api/v1/projects')
      .send({
        name: 'August project',
        description: 'This is a new project',
      })
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('EDIT: project', function(done) {
    testProject.name = 'Update project';
    chai
      .request(server)
      .put('/api/v1/projects/' + testProject._id)
      .send(testProject)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  // delete at the end
  it('Delete: project', function(done) {
    chai
      .request(server)
      .delete('/api/v1/projects/' + testProject._id)
      .set('Authorization', token)
      .end(function(err, res) {
        res.should.have.status(200);
        Project.findOne({ id: testProject._id }).then(project => {
          assert(project === null, 'project should be null');
          done();
        });
      });
  });
});
