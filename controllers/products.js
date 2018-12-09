const Project = require('../models/project');

/**
 * Post Product
 */
exports.addProduct = function(req, res, next) {
  var product = req.body;
  var projectId = req.body.projectId;
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    project.products.push(product);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Get product
 */
exports.product = function(req, res, next) {
  var ids = req.params.id.split('==');
  var projectId = ids[0];
  var productId = ids[1];
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var product = project.products.id(productId);
    res.json({ product: product });
  });
};

/**
 * Put product
 */
exports.updateProduct = function(req, res, next) {
  var product = req.body;
  var projectId = req.body.projectId;
  Project.findOne({ _id: projectId }).exec(function(error, project) {
    if (error) {
      return next(error);
    }
    var a = project.products.id(product._id);
    a.set(product);
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};

/**
 * Delete product
 */
exports.removeProduct = function(req, res, next) {
  var ids = req.params.id.split('==');
  var id = ids[0];
  var productId = ids[1];
  Project.findOne({ _id: id }, function(error, project) {
    if (error) {
      return next(error);
    }
    project.products.pull({ _id: productId });
    project.save(function(err, p) {
      if (err) {
        return next(err);
      }
      res.json({ project: p });
    });
  });
};
