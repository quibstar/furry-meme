const Inventory = require('../models/inventory');

exports.inventory = function(req, res, next) {
  const accountId = req.user.accountId;
  Inventory.find({ accountId: accountId }, function(error, inventory) {
    if (error) {
      return next(error);
    }
    res.json({ inventory: inventory });
  });
};

exports.create = function(req, res, next) {
  inventory = new Inventory({
    accountId: req.user.accountId,
    name: req.body.name,
    category: req.body.category,
    amount: req.body.amount,
    accountNumber: req.body.lineItems,
    model: req.body.model,
    serialNumber: req.body.serialNumber,
    pricePerUnit: req.body.pricePerUnit,
    quantity: req.body.quantity,
    location: req.body.location,
    unitType: req.body.unitType,
    createdAt: Date.now(),
  });

  inventory.save(function(err, b) {
    if (err) {
      return next(err);
    }
    res.json({ success: b });
  });
};

exports.update = function(req, res, next) {
  var inventory = req.body;

  Inventory.findByIdAndUpdate(inventory._id, inventory, { new: true }, function(err, i) {
    if (err) {
      return next(err);
    }
    res.json({ inventory: i });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  Inventory.findOne({ _id: id }, function(error, inventory) {
    if (error) {
      return next(error);
    }
    res.json({ inventory: inventory });
  });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  Inventory.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ inventory: {} });
  });
};
