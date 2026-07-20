const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all products
const getAllProducts = async (req, res, next) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get all products'
     #swagger.description = 'Retrieves a list of all products from the database.' */
  try {
    const result = await mongodb.getDb().db().collection('products').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET single product by ID
const getProductById = async (req, res, next) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by ID'
     #swagger.description = 'Retrieves a single product using its 24-character ObjectId.' */
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('products').findOne({ _id: productId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST create product (8 fields)
const createProduct = async (req, res, next) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Create a new product'
     #swagger.description = 'Creates a new product in the database. Requires 8 fields.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product object',
        required: true,
        schema: {
          name: 'Wireless Noise-Canceling Headphones',
          description: 'High-quality over-ear Bluetooth headphones with active noise cancellation.',
          category: 'Electronics',
          price: 199.99,
          stock: 45,
          brand: 'SoundPro',
          rating: 4.8,
          isAvailable: true
        }
     } */
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      brand: req.body.brand,
      rating: Number(req.body.rating),
      isAvailable: Boolean(req.body.isAvailable)
    };

    const response = await mongodb.getDb().db().collection('products').insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({ success: false, message: 'Some error occurred while creating the product.' });
    }
  } catch (error) {
    next(error);
  }
};

// PUT update product by ID
const updateProduct = async (req, res, next) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Update a product by ID'
     #swagger.description = 'Updates an existing product in the database.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated product object',
        required: true,
        schema: {
          name: 'Wireless Noise-Canceling Headphones V2',
          description: 'Updated high-quality Bluetooth headphones with improved ANC.',
          category: 'Electronics',
          price: 219.99,
          stock: 30,
          brand: 'SoundPro',
          rating: 4.9,
          isAvailable: true
        }
     } */
  try {
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      brand: req.body.brand,
      rating: Number(req.body.rating),
      isAvailable: Boolean(req.body.isAvailable)
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('products')
      .replaceOne({ _id: productId }, product);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' });
    } else {
      // Document matched but no values changed
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

// DELETE product by ID
const deleteProduct = async (req, res, next) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Delete a product by ID'
     #swagger.description = 'Deletes a product from the database.' */
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('products')
      .deleteOne({ _id: productId });

    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
