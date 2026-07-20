const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const {
  productValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all products
router.get('/', productsController.getAllProducts);

// GET single product by ID
router.get('/:id', validateId(), handleValidationErrors, productsController.getProductById);

// POST create product
router.post('/', productValidationRules(), handleValidationErrors, productsController.createProduct);

// PUT update product by ID
router.put('/:id', validateId(), productValidationRules(), handleValidationErrors, productsController.updateProduct);

// DELETE product by ID
router.delete('/:id', validateId(), handleValidationErrors, productsController.deleteProduct);

module.exports = router;
