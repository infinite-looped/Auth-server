//Global API rate limiting using express-rate-limit
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;;
const redis = require("../config/redis.config");
const globalRateLimiter = rateLimit({
    
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, //Return rate limit info in headers
    legacyHeaders: false, 
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix:"rl:global:",
    }),
    message: {
        message: "Too many request. Please try again later"
    }
});


module.exports = {
    globalRateLimiter,
}