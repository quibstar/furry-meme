const Task = require('../models/task');

exports.tasks = function(req, res, next) {
  const accountId = req.user.accountId;
  Task.find({ accountId: accountId }, function(error, tasks) {
    if (error) {
      return next(error);
    }
    res.json({ tasks: tasks });
  });
};

exports.create = function(req, res, next) {
  task = new Task({
    accountId: req.user.accountId,
    name: req.body.name,
    taskItems: req.body.taskItems,
    createdAt: Date.now(),
  });

  task.save(function(err, b) {
    if (err) {
      console.log(err.message);
      return next(err);
    }
    res.json({ success: b });
  });
};

exports.update = function(req, res, next) {
  var task = req.body;

  Task.findByIdAndUpdate(task._id, task, { new: true }, function(err, t) {
    if (err) {
      return next(err);
    }
    res.json({ task: t });
  });
};

exports.show = function(req, res, next) {
  var id = req.params.id;
  Task.findOne({ _id: id }, function(error, task) {
    if (error) {
      return next(error);
    }
    res.json({ task: task });
  });
};

exports.delete = function(req, res, next) {
  var id = req.params.id;
  Task.findOneAndDelete({ _id: id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ task: {} });
  });
};
