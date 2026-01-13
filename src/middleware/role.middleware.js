//Role-based access control checks
/**
 * Role-based access control middleware
 * @param {...string} allowedRoles
 */

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.roles){
            res.status(401).json({
                message: "Unauthorized"
            });
        }

        const hasRole = req.user.roles.some((role) =>
          allowedRoles.includes(role)
        );
        if(! hasRole){
          return res.status(403).json({
              message: "Permission denied"
           });   
        } 
        next();
    };
};

module.exports = roleMiddleware;


