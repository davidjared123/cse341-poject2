const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all users
const getAllUsers = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Get all users'
     #swagger.description = 'Retrieves a list of all user profiles from the database.' */
  try {
    const result = await mongodb.getDb().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET single user by ID
const getUserById = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Get user by ID'
     #swagger.description = 'Retrieves a single user profile using its 24-character ObjectId.' */
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('users').findOne({ _id: userId });

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST create user
const createUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Create a new user profile'
     #swagger.description = 'Creates a new user profile in the database. Requires 5 fields.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'User object',
        required: true,
        schema: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          username: 'janedoe',
          role: 'Customer'
        }
     } */
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      role: req.body.role
    };

    const response = await mongodb.getDb().db().collection('users').insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'User profile created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({ success: false, message: 'Some error occurred while creating the user profile.' });
    }
  } catch (error) {
    next(error);
  }
};

// PUT update user by ID
const updateUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Update a user profile by ID'
     #swagger.description = 'Updates an existing user profile in the database.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated user object',
        required: true,
        schema: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          username: 'janesmith',
          role: 'Admin'
        }
     } */
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      role: req.body.role
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'User not found.' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

// DELETE user by ID
const deleteUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Delete a user profile by ID'
     #swagger.description = 'Deletes a user profile from the database.' */
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'User profile deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
