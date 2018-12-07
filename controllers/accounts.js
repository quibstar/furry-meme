const Account = require('../models/account');

exports.account = function(req, res, next) {
  const id = req.user.accountId;
  Account.findOne({ _id: id })
    .then(account => {
      res.json({ account: account });
    })
    .catch(err => {
      res.json({ error: err });
    });
};

exports.update = function(req, res, next) {
  const id = req.user.accountId;
  Account.findOneAndUpdate({ _id: id }, { $set: req.body.account }, { new: true }, function(err, account) {
    if (err) {
      return res.status(422).send({ error: 'Something went wrong. Please try again' });
    }
    res.json({ success: 'Successfully updated account.' });
  });
};
