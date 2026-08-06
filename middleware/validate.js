const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

// Validation rules for Products (Collection 1 - 8 fields)
const productValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required and cannot be empty.'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required.'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required.'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number greater than 0.'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be an integer greater than or equal to 0.'),
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('Brand is required.'),
    body('rating')
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be a number between 0 and 5.'),
    body('isAvailable')
      .isBoolean()
      .withMessage('isAvailable must be a boolean value (true or false).')
  ];
};

// Validation rules for Orders (Collection 2 - 5 fields)
const orderValidationRules = () => {
  return [
    body('customerName')
      .trim()
      .notEmpty()
      .withMessage('Customer name is required.'),
    body('productName')
      .trim()
      .notEmpty()
      .withMessage('Product name is required.'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be an integer of at least 1.'),
    body('totalAmount')
      .isFloat({ min: 0.01 })
      .withMessage('Total amount must be a positive number greater than 0.'),
    body('status')
      .trim()
      .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
      .withMessage('Status must be one of: Pending, Processing, Shipped, Delivered, Cancelled.')
  ];
};

// Validation rules for Users (firstName, lastName, email, username, role)
const userValidationRules = () => {
  return [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required and cannot be empty.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required and cannot be empty.'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address.'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required and cannot be empty.'),
    body('role')
      .trim()
      .isIn(['Admin', 'Customer', 'Guest'])
      .withMessage('Role must be one of: Admin, Customer, Guest.')
  ];
};

// Validation rules for Reviews (productId, reviewerName, rating, comment)
const reviewValidationRules = () => {
  return [
    body('productId')
      .trim()
      .custom((value) => {
        if (!ObjectId.isValid(value)) {
          throw new Error('Product ID must be a valid 24-character hexadecimal ObjectId.');
        }
        return true;
      }),
    body('reviewerName')
      .trim()
      .notEmpty()
      .withMessage('Reviewer name is required and cannot be empty.'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5.'),
    body('comment')
      .trim()
      .notEmpty()
      .withMessage('Comment is required and cannot be empty.')
  ];
};

// Mongo ObjectId param validation
const validateId = () => {
  return [
    param('id').custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid ID format. Must be a valid 24-character hexadecimal ObjectId.');
      }
      return true;
    })
  ];
};

// Middleware to handle validation error responses
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  productValidationRules,
  orderValidationRules,
  userValidationRules,
  reviewValidationRules,
  validateId,
  handleValidationErrors
};
