const Debt = require('../models/debt');

exports.debts = function(req, res, next) {
  const accountId = req.user.accountId;
  Debt.find({ accountId: accountId })
    .populate('payments')
    .exec(function(error, debts) {
      if (error) {
        return next(error);
      }
      res.json({ debts: debts });
    });
};

exports.create = function(req, res, next) {
  debt = new Debt({
    accountId: req.user.accountId,
    name: req.body.name,
    category: req.body.category,
    amount: req.body.amount,
    accountNumber: req.body.accountNumber,
    payments: req.body.payments,
    createdAt: Date.now(),
  });

  debt.save(function(err, b) {
    if (err) {
      return next(err);
    }
    res.json({ success: b });
  });
};

exports.update = function(req, res, next) {
  var debt = req.body;
  Debt.findByIdAndUpdate(debt._id, debt, { new: true }, function(err, b) {
    if (err) {
      return next(err);
    }
    res.json({ debt: b });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  Debt.findOne({ _id: id })
    .populate('payments')
    .exec(function(error, debt) {
      if (error) {
        return next(error);
      }
      res.json({ debt: debt });
    });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  Debt.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ debt: {} });
  });
};
