//JWT sign and verify 
const jwt = require("jsonwebtoken");
const { env } = require("../config/env.config");

const signAccessToken = (payload) => {
    return jwt.sign(
        payload,
        env.jwtAccessSecret,       
    {
      expiresIn:"15m",
      issuer:"auth-server",
    });
};
//verification
const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtAccessSecret);
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
};