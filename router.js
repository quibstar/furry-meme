const Authentication = require('./controllers/authentication');
require('./services/passport'); // dont delete needed
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

// controllers
const Accounts = require('./controllers/accounts');
const Budgets = require('./controllers/budgets');
const Debts = require('./controllers/debts');
const Categories = require('./controllers/categories');
const Lists = require('./controllers/lists');
const Tasks = require('./controllers/tasks');
const Inventory = require('./controllers/inventory');
const Users = require('./controllers/users');
const Payments = require('./controllers/payments');
const Projects = require('./controllers/projects');
const Products = require('./controllers/products');
const Receipts = require('./controllers/receipts');

module.exports = function(app) {
  app.get('/api/server-test', function(req, res, next) {
    res.send("I'm working");
  });

  app.post('/api/v1/signup', Authentication.signup);
  app.post('/api/v1/signin', requireSignin, Authentication.signin);

  // Account
  app.get('/api/v1/account', requireAuth, Accounts.account);

  // Account/categories
  app.get('/api/v1/categories', requireAuth, Categories.categories);
  app.put('/api/v1/categories/:id', requireAuth, Categories.update);

  // budgets
  app.get('/api/v1/budgets', requireAuth, Budgets.budgets);
  app.post('/api/v1/budgets', requireAuth, Budgets.create);
  app.get('/api/v1/budgets/:id', requireAuth, Budgets.show);
  app.put('/api/v1/budgets/:id', requireAuth, Budgets.update);
  app.delete('/api/v1/budgets/:id', requireAuth, Budgets.delete);

  // Debts
  app.get('/api/v1/debts', requireAuth, Debts.debts);
  app.post('/api/v1/debts', requireAuth, Debts.create);
  app.get('/api/v1/debts/:id', requireAuth, Debts.show);
  app.put('/api/v1/debts/:id', requireAuth, Debts.update);
  app.delete('/api/v1/debts/:id', requireAuth, Debts.delete);

  // Tasks
  app.get('/api/v1/tasks', requireAuth, Tasks.tasks);
  app.post('/api/v1/tasks', requireAuth, Tasks.create);
  app.get('/api/v1/tasks/:id', requireAuth, Tasks.show);
  app.put('/api/v1/tasks/:id', requireAuth, Tasks.update);
  app.delete('/api/v1/tasks/:id', requireAuth, Tasks.delete);

  // Lists
  app.get('/api/v1/lists', requireAuth, Lists.lists);
  app.post('/api/v1/lists', requireAuth, Lists.create);
  app.get('/api/v1/lists/:id', requireAuth, Lists.show);
  app.put('/api/v1/lists/:id', requireAuth, Lists.update);
  app.delete('/api/v1/lists/:id', requireAuth, Lists.delete);

  // Inventory
  app.get('/api/v1/inventory', requireAuth, Inventory.inventory);
  app.post('/api/v1/inventory', requireAuth, Inventory.create);
  app.get('/api/v1/inventory/:id', requireAuth, Inventory.show);
  app.put('/api/v1/inventory/:id', requireAuth, Inventory.update);
  app.delete('/api/v1/inventory/:id', requireAuth, Inventory.delete);

  // Users
  app.get('/api/v1/users', requireAuth, Users.users);
  app.post('/api/v1/users', requireAuth, Users.create);
  app.get('/api/v1/users/:id', requireAuth, Users.show);
  app.get('/api/v1/current-user', requireAuth, Users.currentUser);
  app.put('/api/v1/users/:id', requireAuth, Users.update);
  app.delete('/api/v1/users/:id', requireAuth, Users.delete);

  // payments
  app.get('/api/v1/payments', requireAuth, Payments.payments);
  app.post('/api/v1/payments', requireAuth, Payments.create);
  app.get('/api/v1/payments/:id', requireAuth, Payments.show);
  app.put('/api/v1/payments/:id', requireAuth, Payments.update);
  app.delete('/api/v1/payments/:id', requireAuth, Payments.delete);

  // projects
  app.get('/api/v1/projects', requireAuth, Projects.projects);
  app.post('/api/v1/projects', requireAuth, Projects.create);
  app.get('/api/v1/projects/:id', requireAuth, Projects.show);
  app.put('/api/v1/projects/:id', requireAuth, Projects.update);
  app.delete('/api/v1/projects/:id', requireAuth, Projects.delete);

  //Project Areas
  app.get('/api/v1/project-area/:id', requireAuth, Projects.area);
  app.post('/api/v1/project-area', requireAuth, Projects.addArea);
  app.put('/api/v1/project-area/:id', requireAuth, Projects.updateArea);
  app.delete('/api/v1/area-delete/:id', requireAuth, Projects.removeArea);

  // Project area costs
  app.get('/api/v1/area-costs/:id', requireAuth, Projects.costs);
  app.get('/api/v1/area-cost/:id', requireAuth, Projects.cost);
  app.post('/api/v1/area-cost', requireAuth, Projects.addCost);
  app.put('/api/v1/area-cost/:id', requireAuth, Projects.updateCost);
  app.delete('/api/v1/cost-delete/:id', requireAuth, Projects.removeCost);

  //Project Product
  app.get('/api/v1/project-product/:id', requireAuth, Products.product);
  app.post('/api/v1/project-product', requireAuth, Products.addProduct);
  app.put('/api/v1/project-product/:id', requireAuth, Products.updateProduct);
  app.delete('/api/v1/product-delete/:id', requireAuth, Products.removeProduct);

  // receipts
  app.get('/api/v1/receipts', requireAuth, Receipts.receipts);
  app.post('/api/v1/receipts', requireAuth, Receipts.create);
  app.get('/api/v1/receipts/:id', requireAuth, Receipts.show);
  app.put('/api/v1/receipts/:id', requireAuth, Receipts.update);
  app.delete('/api/v1/receipts/:id', requireAuth, Receipts.delete);
};
