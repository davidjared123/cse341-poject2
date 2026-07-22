const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  productValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all products
router.get('/', isAuthenticated, productsController.getAllProducts);

// GET single product by ID
router.get('/:id', isAuthenticated, validateId(), handleValidationErrors, productsController.getProductById);

// POST create product
router.post('/', isAuthenticated, productValidationRules(), handleValidationErrors, productsController.createProduct);

// PUT update product by ID
router.put('/:id', isAuthenticated, validateId(), productValidationRules(), handleValidationErrors, productsController.updateProduct);

// DELETE product by ID
router.delete('/:id', isAuthenticated, validateId(), handleValidationErrors, productsController.deleteProduct);

module.exports = router;
