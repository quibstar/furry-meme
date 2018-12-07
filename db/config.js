var config = {};

config.mongoURI = {
  // development: 'mongodb://homeOfficeAdmin:Tucker79!@ds253891.mlab.com:53891/home-office',
  // test: 'mongodb://homeOfficeTest:Tucker79!@ds257981.mlab.com:57981/home-office-test',
  development: 'mongodb://localhost:27017/home-office-development',
  test: 'mongodb://localhost:27017/home-office-test',
  production: process.env.MONGODB,
};

module.exports = config;
