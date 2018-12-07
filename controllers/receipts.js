const Receipt = require('../models/receipt');

exports.receipts = function(req, res, next) {
  const accountId = req.user.accountId;
  Receipt.find({ accountId: accountId }, function(error, receipts) {
    if (error) {
      return next(error);
    }
    res.json({ receipts: receipts });
  });
};

exports.create = function(req, res, next) {
  var receipt = new Receipt(req.body);
  receipt.accountId = req.user.accountId;
  receipt.created = Date.now();
  receipt.save(function(err, b) {
    if (err) {
      return next(err);
    }
    res.json({ receipt: b });
  });
};

exports.update = function(req, res, next) {
  var receipt = req.body;

  Receipt.findByIdAndUpdate(receipt._id, receipt, { new: true }, function(err, l) {
    if (err) {
      return next(err);
    }
    res.json({ receipt: l });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  Receipt.findOne({ _id: id }, function(error, receipt) {
    if (error) {
      return next(error);
    }
    res.json({ receipt: receipt });
  });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  Receipt.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ receipt: {} });
  });
};
