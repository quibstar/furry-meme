const Payment = require('../models/payment');
const Debt = require('../models/debt');
const Budget = require('../models/budget');

exports.payments = function(req, res, next) {
  const debtId = req.body.debtId;
  Payment.find({ debtId: debtId }, function(error, payments) {
    if (error) {
      return next(error);
    }
    res.json({ payments: payments });
  });
};

exports.create = function(req, res, next) {
  var payment = new Payment({
    debtId: req.body.debtId,
    budgetId: req.body.budgetId,
    note: req.body.note,
    amount: req.body.amount,
    paidOn: req.body.paidOn,
    createdAt: Date.now(),
    name: req.body.name,
    category: req.body.category,
  });
  if (req.body.debtId && req.body.budgetId) {
    addToBudgetAndDebt(payment, req, res);
  } else if (req.body.debtId) {
    addToDebt(payment, req, res);
  } else if (req.body.budgetId) {
    addToBudget(payment, req, res);
  }
};

function addToDebt(payment, req, res) {
  console.log('add to debt');
  payment
    .save()
    .then(() => Debt.findOne({ _id: req.body.debtId }))
    .then(debt => {
      debt.payments.push(payment);
      debt.save();
      res.json({ debt: debt });
    })
    .catch(err => {
      res.json({ error: err });
    });
}

function addToBudget(payment, req, res) {
  console.log('add to budget');
  payment
    .save()
    .then(() => Budget.findOne({ _id: req.body.budgetId }))
    .then(budget => {
      budget.payments.push(payment);
      budget.save();
      res.json({ budget: budget });
    })
    .catch(err => {
      res.json({ error: err });
    });
}

function addToBudgetAndDebt(payment, req, res) {
  console.log('add to bud and debt');
  payment
    .save()
    .then(() => Debt.findOne({ _id: req.body.debtId }))
    .then(debt => {
      debt.payments.push(payment);
      debt.save();
    })
    .then(() => Budget.findOne({ _id: req.body.budgetId }))
    .then(budget => {
      budget.payments.push(payment);
      budget.save();
      res.json({ budget: budget });
    })
    .catch(err => {
      res.json({ error: err });
    });
}

exports.update = function(req, res, next) {
  var payment = req.body;
  Payment.findByIdAndUpdate(req.params.id, payment, { new: true }, function(err, p) {
    if (err) {
      return next(err);
    }
    res.json({ payment: p });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  Payment.findOne({ _id: id }, function(error, payment) {
    if (error) {
      return next(error);
    }
    res.json({ payment: payment });
  });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  Payment.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ payment: {} });
  });
};
