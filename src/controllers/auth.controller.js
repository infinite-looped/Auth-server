//Signup and login request handling


const {login, signup} = require("../services/auth.service");
const {setRefreshTokenCookie} = require("../utils/cookie.util");
const {signupSchema, loginSchema} = require("../validators/auth.schema");

const signupController = async (req, res, next) => {
    try{
        signupSchema.parse(req.body);
        const { email, password} = req.body;
        const user = await signup({email, password});
        res.status(201).json({
            success: true,
            message: "Signup succeeded",
            data: user,
        });
    }catch(err){
        next(err);
    }
}
const loginController = async(req, res, next) => {
    try{
        loginSchema.parse(req.body);
        const {email, password} = req.body;
        const {accessToken, refreshToken} = await login({
            email,
            password,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
        });
        //Reset brute-force attempts on successful login (Redis)
        if(req.resetAttempts) {
            await req.resetAttempts();
        }
        //Store refresh token in HTTP-only secure cookie
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({
            success: true,
            accessToken,
        });
    }catch(err){
        //Record failed attempt (Redis)
        if (req.recordFailedAttempt) {
          await req.recordFailedAttempt();
        }
        next(err);
    }
};
module.exports = {
    signupController,
    loginController
}