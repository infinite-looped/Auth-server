//Core authentication business logic
const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");

const { hashPassword, comparePassword } = require("../utils/bcrypt.util");
const { generateRandomToken, hashToken} = require("../utils/crypto.util");
const { signAccessToken } = require("../utils/jwt.util");
const UserModel = require("../models/User.model");

//signup service
const signup = async ({email, password}) => {
   

    const existingUser = await User.findOne({email});
    
    if(existingUser) {
        const err = new Error ("User already exist");
        err.statusCode = 409;
        throw err;
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        email,
        password: hashedPassword,
        roles: ["USER"],
    });

    return {
        userId: user._id,
        email: user.email,
    };
};

//login (verifies user credential and issues token)

const login = async ({email, password, userAgent, ipAddress}) => {
    const user = await User.findOne({email});
    if(!user || !user.password) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }


    const isValidPassword = await comparePassword(password, user.password);
    if(!isValidPassword) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }

    //acess token (JWT)
    const accessToken = signAccessToken({
        sub: user._id,
        roles: user.roles,
    });

    //Refresh token
    const refreshToken = generateRandomToken();
    const refreshTokenHash = hashToken(refreshToken);

    await RefreshToken.create({
        userId: user._id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent,
        ipAddress,
    });

    return{
        accessToken,
        refreshToken, //controller will put this into cookie
    };
};

module.exports = {
    login,
    signup,
}
