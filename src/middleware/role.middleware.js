/**
 * Role-based access control middleware
 * @param {...string} allowedRoles
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      return next(err);
    }

    const hasRole = req.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      const err = new Error("Permission denied");
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

module.exports = roleMiddleware;
