const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  orderValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all orders
router.get('/', isAuthenticated, ordersController.getAllOrders);

// GET single order by ID
router.get('/:id', isAuthenticated, validateId(), handleValidationErrors, ordersController.getOrderById);

// POST create order
router.post('/', isAuthenticated, orderValidationRules(), handleValidationErrors, ordersController.createOrder);

// PUT update order by ID
router.put('/:id', isAuthenticated, validateId(), orderValidationRules(), handleValidationErrors, ordersController.updateOrder);

// DELETE order by ID
router.delete('/:id', isAuthenticated, validateId(), handleValidationErrors, ordersController.deleteOrder);

module.exports = router;
