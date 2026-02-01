//JWT verification and user authentication
//Uses access token only
const { verifyAccessToken } = require("../utils/jwt.util")

//Authenticate requests using JWT access token
const authMiddleware = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return  res.status(401).json({
                message: "Authentication failed"
            });

        }
        const token = authHeader.split(" ")[1];
        //verifying the token by calling verifyAccessToken, function present in "../utils/jwt.util"
        const decoded = verifyAccessToken(token);

        // attaching user info
        req.user = {
            userId: decoded.sub,
            roles: decoded.roles,
        };
        next();
    } catch(error){
        return res.status(401).json({
            message: "unauthorized: Invalid or expired token"
        });
    };  
    
};

module.exports = authMiddleware;