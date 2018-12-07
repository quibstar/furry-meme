const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var User = require('../models/user');
var Account = require('../models/account');
var Budget = require('../models/budget');
var Payment = require('../models/payment');

before(done => {
  Account.findOne({ name: 'test' }, function(err, existingAccount) {
    if (err) {
      return next(err);
    }
    if (!existingAccount) {
      var account = new Account({
        name: 'test',
        categories: [
          { name: 'budgets', categories: [] },
          { name: 'debts', categories: [] },
          { name: 'goals', categories: [] },
          { name: 'lists', categories: [] },
          { name: 'tasks', categories: [] },
          { name: 'inventory', categories: [] },
        ],
      });
      account.save(function(err, account) {
        create_user(done, account);
      });
    }
  });
});

after(done => {
  Account.collection.drop();
  User.collection.drop();

  if (Budget.collection.count) {
    Budget.collection.drop();
  }
  // Debt.collection.drop();
  // Payment.collection.drop();

  done();
});

function create_user(done, account) {
  var user = new User({
    email: 'quibstar@gmail.com',
    firstName: 'Kris',
    lastName: 'Utter',
    password: 'p',
    accountId: account.id,
    role: 'admin',
  });
  user.save(function(err) {
    create_budget(done);
  });
}

function create_budget(done) {
  var payment = new Payment({
    name: 'Car Payment2',
    amount: 135.42,
    paid: false,
    note: 'Paid this off early to get some more money in savings',
  });
  var budget = new Budget({
    name: 'August Budget',
    category: 'home',
    amount: '123',
  });
  payment.save();
  budget.payments.push(payment);
  budget.save(function(err, b) {
    // console.log('test helper:', err, b);
    done();
  });
}
