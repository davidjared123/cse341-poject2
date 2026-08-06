const swaggerAutogen = require('swagger-autogen')();

const host = process.env.RENDER_EXTERNAL_URL
  ? process.env.RENDER_EXTERNAL_URL.replace(/^https?:\/\//, '')
  : (process.env.HOST || 'localhost:8080');

const doc = {
  info: {
    title: 'CSE 341 Project 2 API',
    description: 'REST API documentation for Products, Orders, Users, and Reviews management (Project 2). Requires authentication for state-modifying and query endpoints under /products, /orders, /users, and /reviews.'
  },
  host: host,
  schemes: process.env.RENDER_EXTERNAL_URL ? ['https'] : ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
