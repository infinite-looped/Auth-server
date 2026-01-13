//Login and forgot-password brute-force protection
const redis = require("../config/redis.config")

const MAX_ATTTEMPTS = 5;
const LOCK_DURATION= 10 * 60 * 1000; 

//Brute force protection middleware
//Applies to login / forgot-password

const bruteForceMiddleware = async(req, res, next) => {
    try{
        const identifier = req.body.email || req.ip;
        const key = "login_attempt:" + identifier;

        const attempts = await redis.get(key);

        if(attempts && Number(attempts) >= MAX_ATTTEMPTS){
            return res.status(429).json({
                message: "Too many failed attempts. Try again later."
            });
        }

        req.recordFailedAttempt = async() => {
            const current = await redis.incr(key);
            if(current == 1){
                await redis.expire(key, LOCK_DURATION)
            }
        };

        req.resetAttempts = async () => {
           await redis.del(key);
        };    
        next();

    }catch(err){
        next(err);
    }
};
module.exports = bruteForceMiddleware;