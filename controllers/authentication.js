const jwt = require('jwt-simple');
const User = require('../models/user');
const Account = require('../models/account');

function jwtForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
}

exports.jwtForUser = jwtForUser;

exports.signup = function(req, res, next) {
  const account = req.body.account;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if (!email || !password || !account || !name) {
    return res.status(422).send({ error: 'You must provide an account, name, email and password' });
  }
  Account.findOne({ name: account }, function(err, existingAccount) {
    if (err) {
      return next(err);
    }

    if (existingAccount) {
      return res.status(422).send({ error: 'Account already taken.' });
    }

    const newAccount = new Account({
      name: account,
      categories: [
        { name: 'payments', categories: ['Mortgage', 'Utilities'] },
        { name: 'budgets', categories: ['Food', 'Gas'] },
        { name: 'debts', categories: ['Credit Card'] },
        { name: 'lists', categories: ['Shopping'] },
        { name: 'tasks', categories: ['Monthly', 'Weekly', 'Daily'] },
        { name: 'inventory', categories: ['Garage', 'Pantry'] },
        { name: 'receipts', categories: ['Food', 'Gas'] },
      ],
    });

    // check for use
    User.findOne({ email: email }, function(err, existingUser) {
      if (err) {
        return next(err);
      }

      if (existingUser) {
        return res.status(422).send({ error: 'Email in use' });
      }

      // save account after we know that the user is unique
      newAccount.save(function(err) {
        if (err) {
          return next('err');
        }
      });

      var fullname = name.split(' ');
      const user = new User({
        email: email,
        password: password,
        firstName: fullname[0],
        lastName: fullname[1],
        accountId: newAccount._id,
        isOwner: true,
      });

      user.save(function(err) {
        if (err) {
          return next('err');
        }
        res.json({ token: jwtForUser(user) });
      });
    });
  });
};

exports.signin = function(req, res, next) {
  // already authenticated, send a token
  res.send({
    token: jwtForUser(req.user),
  });
};
