var express  = require('express');
var router   = express.Router();

// ***** CONTROLLERS ***** //
var usersController           = require('../controllers/users');
var authenticationsController = require('../controllers/authentications');
var crimesController          = require('../controllers/crimes');

// ***** ROUTES ***** //
router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);

router.route('/users')
  .get(usersController.index);

router.route('/users/:id')
  .get(usersController.show)
  .put(usersController.update)
  .patch(usersController.update)
  .delete(usersController.delete);

router.route('/crimes')
  .get(crimesController.index);

  router.route('/crimesfilter')
    .get(crimesController.filter);

module.exports = router;