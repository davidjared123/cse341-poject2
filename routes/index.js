const express = require('express');
const router = express.Router();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

let swaggerDocument;
try {
  swaggerDocument = require('../swagger.json');
  if (swaggerDocument && process.env.RENDER_EXTERNAL_URL) {
    swaggerDocument.host = process.env.RENDER_EXTERNAL_URL.replace(/^https?:\/\//, '');
    swaggerDocument.schemes = ['https'];
  }
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
     #swagger.description = 'Welcome endpoint for CSE 341 Project 2 API. Displays current login status.' */
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName || req.session.user.username}`
      : 'Logged out'
  );
});

// Authentication routes
router.get('/login', (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Log in via GitHub OAuth'
     #swagger.description = 'Redirects the user to GitHub to authenticate. Requires setting up GitHub OAuth credentials.' */
  passport.authenticate('github', { scope: ['user:email'], prompt: 'select_account' })(req, res, next);
});

router.get(
  '/github/callback',
  (req, res, next) => {
    /* #swagger.tags = ['Authentication']
       #swagger.summary = 'GitHub OAuth Callback'
       #swagger.description = 'Internal callback URL for GitHub to redirect back after authentication.' */
    next();
  },
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

router.get('/logout', (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Log out'
     #swagger.description = 'Logs the current user out, destroys their session, and redirects to the root page.' */
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
