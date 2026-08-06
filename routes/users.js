const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  userValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all users
router.get('/', isAuthenticated, usersController.getAllUsers);

// GET single user by ID
router.get('/:id', isAuthenticated, validateId(), handleValidationErrors, usersController.getUserById);

// POST create user
router.post('/', isAuthenticated, userValidationRules(), handleValidationErrors, usersController.createUser);

// PUT update user by ID
router.put('/:id', isAuthenticated, validateId(), userValidationRules(), handleValidationErrors, usersController.updateUser);

// DELETE user by ID
router.delete('/:id', isAuthenticated, validateId(), handleValidationErrors, usersController.deleteUser);

module.exports = router;
