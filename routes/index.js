const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');

let swaggerDocument;
try {
  swaggerDocument = require('../swagger.json');
} catch (e) {
  swaggerDocument = null;
}

// Swagger UI Route
if (swaggerDocument) {
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  router.get('/api-docs', (req, res) => {
    res.status(404).send('Swagger documentation not found. Please run "npm run swagger" first.');
  });
}

// Collection 1 & Collection 2 Routes
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));

// Root endpoint
router.get('/', (req, res) => {
  /* #swagger.tags = ['Root']
     #swagger.summary = 'API Root'
     #swagger.description = 'Welcome endpoint for CSE 341 Project 2 API.' */
  res.send('Welcome to CSE 341 Project 2 API. Access /api-docs for Swagger documentation.');
});

module.exports = router;
