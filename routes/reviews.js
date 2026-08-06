const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  reviewValidationRules,
  validateId,
  handleValidationErrors
} = require('../middleware/validate');

// GET all reviews
router.get('/', isAuthenticated, reviewsController.getAllReviews);

// GET single review by ID
router.get('/:id', isAuthenticated, validateId(), handleValidationErrors, reviewsController.getReviewById);

// POST create review
router.post('/', isAuthenticated, reviewValidationRules(), handleValidationErrors, reviewsController.createReview);

// PUT update review by ID
router.put('/:id', isAuthenticated, validateId(), reviewValidationRules(), handleValidationErrors, reviewsController.updateReview);

// DELETE review by ID
router.delete('/:id', isAuthenticated, validateId(), handleValidationErrors, reviewsController.deleteReview);

module.exports = router;
