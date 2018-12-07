const Project = require('../models/project');

/**
 * All projects
 */
exports.projects = function(req, res, next) {
  const accountId = req.user.accountId;
  Project.find({ accountId: accountId }).exec(function(error, projects) {
    if (error) {
      return next(error);
    }
    res.json({ projects: projects });
  });
};

/**
 * Edit project
 */
exports.create = function(req, res, next) {
  project = new Project({
    accountId: req.user.accountId,
    name: req.body.name,
    description: req.body.description,
    createdAt: Date.now(),
  });

  project.save(function(err, p) {
    if (err) {
      return next(err);
    }
    res.json({ success: p });
  });
};

/**
 * Update project
 */
exports.update = function(req, res, next) {
  var project = req.body;
  Project.findByIdAndUpdate(req.params.id, project, { new: true }, function(err, p) {
    if (err) {
      return next(err);
    }
    res.json({ project: p });
  });
};

/**
 * Show project
 */
exports.show = function(req, res, next) {
  Project.findOne({ _id: req.params.id })
    .populate('payments')
    .exec(function(error, project) {
      if (error) {
        return next(error);
      }
      res.json({ project: project });
    });
};

/**
 * Delete project
 */
exports.delete = function(req, res, next) {
  Project.findOneAndDelete({ _id: req.params.id }, function(error) {
    if (error) {
      return next(error);
    }
    res.json({ success: 'Project removed' });
  });
};

/**
 * Post Area
 */
exports.addArea = function(req, res, next) {
  var area = req.body;
  var projectId = req.body.projectId;
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    project.areas.push(area);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Get area
 */
exports.area = function(req, res, next) {
  var ids = req.params.id.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var area = project.areas.id(areaId);
    res.json({ area: area });
  });
};

/**
 * Put area
 */
exports.updateArea = function(req, res, next) {
  var area = req.body;
  var projectId = req.body.projectId;
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var a = project.areas.id(area._id);
    a.set(area);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Delete area
 */
exports.removeArea = function(req, res, next) {
  var ids = req.params.id.split('==');
  var id = ids[0];
  var areaId = ids[1];
  Project.findOne({ _id: id }, function(error, project) {
    if (error) {
      return next(error);
    }
    project.areas.pull({ _id: areaId });
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Project area cost
 */

/**
 * Get costs
 */
exports.costs = function(req, res, next) {
  var ids = req.params.id.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var areas = project.areas.id(areaId);
    var costs = areas.cost;
    res.json({ costs: costs });
  });
};

/**
 * Get cost
 */
exports.cost = function(req, res, next) {
  var ids = req.params.id.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  var costId = ids[2];
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var areas = project.areas.id(areaId);
    var cost = areas.cost.id(costId);
    res.json({ cost: cost });
  });
};

/**
 * Post cost
 */
exports.addCost = function(req, res, next) {
  var ids = req.body.ids.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  var cost = req.body;
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var area = project.areas.id(areaId);
    area.cost.push(cost);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Update cost
 */
exports.updateCost = function(req, res, next) {
  console.log(req.body.ids);
  var ids = req.body.ids.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  var costId = req.body._id;
  var cost = req.body;
  Project.findOne({ _id: projectId }, function(error, project) {
    if (error) {
      return next(error);
    }
    var areas = project.areas.id(areaId);
    var c = areas.cost.id(costId);
    c.set(cost);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Delete cost
 */
exports.removeCost = function(req, res, next) {
  var ids = req.params.id.split('==');
  var projectId = ids[0];
  var areaId = ids[1];
  var costId = ids[2];
  Project.findOne({ _id: projectId }, function(error, project) {
    if (error) {
      return next(error);
    }
    var area = project.areas.id(areaId);
    area.cost.pull({ _id: costId });
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};
