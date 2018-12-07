const Budget = require('../models/budget');

exports.budgets = function(req, res, next) {
  const accountId = req.user.accountId;
  Budget.find({ accountId: accountId })
    .populate('payments')
    .exec(function(error, budgets) {
      if (error) {
        return next(error);
      }
      res.json({ budgets: budgets });
    });
};

exports.create = function(req, res, next) {
  budget = new Budget({
    accountId: req.user.accountId,
    name: req.body.name,
    category: req.body.category,
    amount: req.body.amount,
    createdAt: Date.now(),
  });

  budget.save(function(err, b) {
    if (err) {
      console.log(err.message);
      return next(err);
    }
    res.json({ success: b });
  });
};

exports.update = function(req, res, next) {
  var budget = req.body;
  Budget.findByIdAndUpdate(req.params.id, budget, { new: true }, function(err, b) {
    if (err) {
      return next(err);
    }
    res.json({ budget: b });
  });
};

exports.show = function(req, res, next) {
  Budget.findOne({ _id: req.params.id })
    .populate('payments')
    .exec(function(error, budget) {
      if (error) {
        console.log(err);
        return next(error);
      }
      res.json({ budget: budget });
    });
};

exports.delete = function(req, res, next) {
  Budget.findOneAndDelete({ _id: req.params.id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ budget: budget });
  });
};
