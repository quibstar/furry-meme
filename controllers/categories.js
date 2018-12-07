const Account = require('../models/account');

exports.categories = function(req, res, next) {
  const id = req.user.accountId;
  Account.findOne({ _id: req.user.accountId })
    .then(account => {
      // return an array of categories
      res.json(account.categories);
    })
    .catch(err => {
      res.json({ error: err });
    });
};

// exports.update = function(req, res, next) {
//   const id = req.user.accountId;
//   Account.findOneAndUpdate({ _id: id }, { categories: req.body }, { new: true }, function(err, account) {
//     if (err) {
//       return res.status(422).send({ error: 'Something went wrong. Please try again' });
//     }
//     res.json({ success: account });
//   });
// };

exports.update = function(req, res, next) {
  const id = req.user.accountId;
  const catId = req.body._id;
  const categories = req.body.categories;
  console.log(res.body);
  Account.findOneAndUpdate(
    { _id: id, 'categories._id': catId },
    { 'categories.$.categories': categories },
    { new: true },
    function(err, c) {
      if (err) {
        return res.status(422).send({ error: 'Something went wrong. Please try again' });
      }
      res.json({ success: { category: c } });
    }
  );
};
