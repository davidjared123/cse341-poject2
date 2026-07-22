const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'You do not have access. Please log in first.' });
};

module.exports = {
  isAuthenticated
};
