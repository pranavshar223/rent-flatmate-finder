const { AuthorizationError } = require('../shared/errors');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(`Access denied. Allowed roles: ${allowedRoles.join(', ')}`));
    }
    next();
  };
};

module.exports = requireRole;
