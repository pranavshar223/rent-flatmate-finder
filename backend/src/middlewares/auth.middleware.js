const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AuthenticationError } = require('../shared/errors');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid authorization header.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // Contains { userId, role }
    next();
  } catch (error) {
    return next(new AuthenticationError('Token has expired or is invalid.'));
  }
};

module.exports = requireAuth;
