process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
chai.should();

chai.use(chaiHttp);

describe('GET /server-test', function() {
  it('should return 200 ', function(done) {
    chai
      .request(server)
      .get('/api/server-test')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});
