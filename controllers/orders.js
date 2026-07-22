const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all orders
const getAllOrders = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('orders').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('orders').findOne({ _id: orderId });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST create order
const createOrder = async (req, res, next) => {

  try {
    const order = {
      customerName: req.body.customerName,
      productName: req.body.productName,
      quantity: Number(req.body.quantity),
      totalAmount: Number(req.body.totalAmount),
      status: req.body.status
    };

    const response = await mongodb.getDb().db().collection('orders').insertOne(order);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({ success: false, message: 'Some error occurred while creating the order.' });
    }
  } catch (error) {
    next(error);
  }
};

// PUT update order by ID
const updateOrder = async (req, res, next) => {
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Update an order by ID'
     #swagger.description = 'Updates an existing order in the database.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated order object',
        required: true,
        schema: {
          customerName: 'John Doe',
          productName: 'Wireless Noise-Canceling Headphones',
          quantity: 2,
          totalAmount: 399.98,
          status: 'Shipped'
        }
     } */
  try {
    const orderId = new ObjectId(req.params.id);
    const order = {
      customerName: req.body.customerName,
      productName: req.body.productName,
      quantity: Number(req.body.quantity),
      totalAmount: Number(req.body.totalAmount),
      status: req.body.status
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('orders')
      .replaceOne({ _id: orderId }, order);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'Order not found.' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

// DELETE order by ID
const deleteOrder = async (req, res, next) => {
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Delete an order by ID'
     #swagger.description = 'Deletes an order from the database.' */
  try {
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('orders')
      .deleteOne({ _id: orderId });

    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Order not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
