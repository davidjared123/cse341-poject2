const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all reviews
const getAllReviews = async (req, res, next) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get all reviews'
     #swagger.description = 'Retrieves a list of all product reviews from the database.' */
  try {
    const result = await mongodb.getDb().db().collection('reviews').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET single review by ID
const getReviewById = async (req, res, next) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get review by ID'
     #swagger.description = 'Retrieves a single product review using its 24-character ObjectId.' */
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').findOne({ _id: reviewId });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST create review
const createReview = async (req, res, next) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Create a new review'
     #swagger.description = 'Creates a new product review in the database. Requires 4 fields.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Review object',
        required: true,
        schema: {
          productId: '654321654321654321654321',
          reviewerName: 'John Doe',
          rating: 5,
          comment: 'Excellent product! Works perfectly.'
        }
     } */
  try {
    const review = {
      productId: req.body.productId,
      reviewerName: req.body.reviewerName,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      createdAt: req.body.createdAt || new Date().toISOString().split('T')[0]
    };

    const response = await mongodb.getDb().db().collection('reviews').insertOne(review);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({ success: false, message: 'Some error occurred while creating the review.' });
    }
  } catch (error) {
    next(error);
  }
};

// PUT update review by ID
const updateReview = async (req, res, next) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Update a review by ID'
     #swagger.description = 'Updates an existing product review in the database.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated review object',
        required: true,
        schema: {
          productId: '654321654321654321654321',
          reviewerName: 'John Doe',
          rating: 4,
          comment: 'Decent product. Modified review comment.'
        }
     } */
  try {
    const reviewId = new ObjectId(req.params.id);
    const review = {
      productId: req.body.productId,
      reviewerName: req.body.reviewerName,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      createdAt: req.body.createdAt || new Date().toISOString().split('T')[0]
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .replaceOne({ _id: reviewId }, review);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'Review not found.' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

// DELETE review by ID
const deleteReview = async (req, res, next) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Delete a review by ID'
     #swagger.description = 'Deletes a product review from the database.' */
  try {
    const reviewId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .deleteOne({ _id: reviewId });

    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Review not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
