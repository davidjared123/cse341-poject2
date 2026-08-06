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
     #swagger.description = 'Welcome endpoint for CSE 341 Project 2 API. Displays current login status and actions.' */
  
  const isLoggedIn = req.session.user !== undefined;
  let dynamicContent = '';

  if (isLoggedIn) {
    const user = req.session.user;
    const displayName = user.displayName || user.username || 'User';
    const username = user.username || 'github_user';
    
    let avatarHtml = '';
    if (user.photos && user.photos.length > 0) {
      avatarHtml = `<img src="${user.photos[0].value}" class="avatar" alt="Avatar">`;
    } else if (user._json && user._json.avatar_url) {
      avatarHtml = `<img src="${user._json.avatar_url}" class="avatar" alt="Avatar">`;
    } else {
      const initial = displayName.charAt(0).toUpperCase();
      avatarHtml = `<div class="avatar-fallback">${initial}</div>`;
    }

    dynamicContent = `
      <div class="user-profile">
        ${avatarHtml}
        <div class="user-info">
          <div class="user-name">${displayName}</div>
          <div class="user-handle">@${username}</div>
        </div>
        <span class="status-badge">Authenticated</span>
      </div>

      <a href="/api-docs" class="btn btn-accent">
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        Access Swagger API Docs
      </a>
      <a href="/logout" class="btn btn-danger">
        <svg viewBox="0 0 24 24">
          <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>
        </svg>
        Sign Out
      </a>
    `;
  } else {
    dynamicContent = `
      <a href="/login" class="btn btn-github">
        <svg viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Sign In with GitHub
      </a>
      <a href="/api-docs" class="btn btn-primary">
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        Explore API Documentation
      </a>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSE 341: Project 2 API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #10b981;
      --accent-hover: #059669;
      --danger: #ef4444;
      --danger-hover: #dc2626;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      overflow-x: hidden;
    }

    .container {
      width: 100%;
      max-width: 520px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      text-align: center;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo-container {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
      border-radius: 20px;
      margin: 0 auto 24px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
    }

    .logo-icon {
      font-size: 36px;
      font-weight: 800;
      color: #fff;
    }

    h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 15px;
      color: var(--text-muted);
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .user-profile {
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      margin-right: 16px;
      object-fit: cover;
    }

    .avatar-fallback {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      margin-right: 16px;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-main);
    }

    .user-handle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .status-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      margin-bottom: 12px;
      border: none;
    }

    .btn:last-child {
      margin-bottom: 0;
    }

    .btn svg {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .btn-github {
      background: #24292f;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-github:hover {
      background: #2f363d;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }

    .btn-accent {
      background: var(--accent);
      color: #fff;
    }

    .btn-accent:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }

    .btn-danger {
      background: transparent;
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.5);
    }

    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .footer a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer a:hover {
      color: var(--primary);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-container">
      <span class="logo-icon">API</span>
    </div>
    
    <h1>CSE 341: Project 2</h1>
    <p class="subtitle">Products and Orders Management REST API</p>

    ${dynamicContent}

    <div class="footer">
      <span>BYU-Idaho Web Services</span>
      <span>•</span>
      <a href="https://github.com/davidjared123/cse341-poject2" target="_blank">GitHub Repo</a>
    </div>
  </div>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
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
