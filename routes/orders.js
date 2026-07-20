const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const {
  orderValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all orders
router.get('/', ordersController.getAllOrders);

// GET single order by ID
router.get('/:id', validateId(), handleValidationErrors, ordersController.getOrderById);

// POST create order
router.post('/', orderValidationRules(), handleValidationErrors, ordersController.createOrder);

// PUT update order by ID
router.put('/:id', validateId(), orderValidationRules(), handleValidationErrors, ordersController.updateOrder);

// DELETE order by ID
router.delete('/:id', validateId(), handleValidationErrors, ordersController.deleteOrder);

module.exports = router;
