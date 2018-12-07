const List = require('../models/list');

exports.lists = function(req, res, next) {
  const accountId = req.user.accountId;
  List.find({ accountId: accountId }, function(error, lists) {
    if (error) {
      return next(error);
    }
    res.json({ lists: lists });
  });
};

exports.create = function(req, res, next) {
  list = new List({
    accountId: req.user.accountId,
    name: req.body.name,
    listItems: req.body.listItems,
    createdAt: Date.now(),
  });

  list.save(function(err, b) {
    if (err) {
      console.log(err.message);
      return next(err);
    }
    res.json({ success: b });
  });
};

exports.update = function(req, res, next) {
  var list = req.body;

  List.findByIdAndUpdate(list._id, list, { new: true }, function(err, l) {
    if (err) {
      return next(err);
    }
    res.json({ list: l });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  List.findOne({ _id: id }, function(error, list) {
    if (error) {
      return next(error);
    }
    res.json({ list: list });
  });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  List.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ list: {} });
  });
};
