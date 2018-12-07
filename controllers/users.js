const Authentication = require('./authentication');
const User = require('../models/user');
const Mailer = require('./mailer');
const TokenStore = require('./token-store');

function tokenAlreadyExists(token) {
  User.findOne({ resetPasswordToken: token }, function(existingToken) {
    if (existingToken) {
      return true;
    }
    return false;
  });
}

exports.users = function(req, res, next) {
  const accountId = req.user.accountId;
  User.find({ accountId: accountId }, function(error, docs) {
    if (error) {
      return next(error);
    }
    res.json({ users: docs });
  });
};

exports.profile = function(req, res, next) {
  User.findOne({ _id: req.user._id })
    .then(user => {
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.firstName + ' ' + user.lastName,
          accountId: user.accountId,
        },
      });
    })
    .catch(err => {
      res.json({ error: 'record not found' });
    });
};

exports.create = function(req, res, next) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const role = req.body.role;
  const workPhone = req.body.workPhone;
  const mobilePhone = req.body.mobilePhone;

  // check for use
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email in use' });
    }

    // verify unique token
    var token = '';
    var uniqueToken = true;
    while (uniqueToken) {
      token = (Math.random() * 1e64).toString(36);
      uniqueToken = tokenAlreadyExists(token);
    }
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      workPhone: workPhone,
      mobilePhone: mobilePhone,
      password: TokenStore.generateToken,
      accountId: req.user.accountId,
      resetPasswordToken: token,
      resetPasswordSentAt: Date.now(),
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      var sub =
        'Your user profile has been created. Please visit http://localhost:3001/reset-password/' +
        token +
        ' to update your password.';
      var html =
        "<p>Your user profile has been created. Please visit <a href='http://localhost:3001/reset-password/" +
        token +
        "'>here</a> to update your password.";
      Mailer.sendCreatedUserEmail(
        'admin@homeofficeadmin.com',
        email,
        'homeofficeadmin:You user profile has been created',
        sub,
        html
      );
      res.json({ user: user });
    });
  });
};

exports.show = function(req, res, next) {
  User.findOne({ _id: req.params.id })
    .then(user => {
      res.json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          mobilePhone: user.mobilePhone,
          workPhone: user.workPhone,
        },
      });
    })
    .catch(err => {
      res.json({ error: 'record not found' });
    });
};

exports.currentUser = function(req, res, next) {
  const id = req.user._id;
  User.findOne({ _id: id })
    .then(user => {
      res.json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          mobilePhone: user.mobilePhone,
          workPhone: user.workPhone,
        },
      });
    })
    .catch(err => {
      res.json({ error: 'record not found' });
    });
};

exports.resetPassword = function(req, res, next) {
  const token = req.body.token;
  const password = req.body.password;

  User.findOneAndUpdate({ resetPasswordToken: token }, { $set: { password: password } }, { new: true }, function(
    err,
    user
  ) {
    if (err) {
      return err;
    }

    if (!user) {
      return res.status(404).send({ error: 'Resource Not Found' });
    }
    var profile = {
      email: user.email,
      accountId: user.accountId,
    };
    var token = Authentication.jwtForUser(user);
    user.resetPasswordToken = '';
    user.resetPasswordSentAt = null;
    user.save();
    res.json({ token: token, profile: profile });
  });
};

exports.sendResetPassword = function(req, res, next) {
  const email = req.body.email;
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).send({ error: 'Please check your email' });
    }

    // verify unique token
    var token = '';
    var uniqueToken = true;
    while (uniqueToken) {
      token = (Math.random() * 1e64).toString(36);
      uniqueToken = tokenAlreadyExists(token);
    }

    user.resetPasswordToken = token;
    user.resetPasswordSentAt = Date.now();

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      var sub =
        'A reset password email has been generated. Please visit http://localhost:3001/reset-password/' +
        token +
        ' to update your password. If this was not generated by you please disregard.';
      var html =
        "<p>A reset password email has been generated. Please visit <a href='http://localhost:3001/reset-password/" +
        token +
        "'>here</a> to update your password.. If this was not generated by you please disregard.";
      Mailer.sendCreatedUserEmail(
        'admin@homeofficeadmin.com',
        email,
        'homeofficeadmin:Reset password request.',
        sub,
        html
      );
      res.json({ user: user });
    });
  });
};

exports.update = function(req, res, next) {
  const id = req.params.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const mobilePhone = req.body.mobilePhone;
  const workPhone = req.body.workPhone;
  const email = req.body.email;
  const role = req.body.role;
  User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        mobilePhone: mobilePhone,
        workPhone: workPhone,
        email: email,
        role: role,
      },
    },
    { new: true },
    function(err, user) {
      if (err) {
        if (err.code === 11000) {
          return res.status(404).send({ error: 'Email alread in use' });
        } else {
          return res.status(404).send({ error: 'Something went wrong. Please try again' });
        }
      } else {
        if (!user) {
          return res.status(404).send({ error: 'Resource Not Found' });
        }
        res.json({ user: user });
      }
    }
  );
};

exports.delete = function(req, res, next) {
  User.findByIdAndRemove({ _id: req.query.id })
    .then(() => {
      res.json({ message: 'User deleted' });
    })
    .catch(err => {
      res.json({ error: 'record not be removed' });
    });
};
