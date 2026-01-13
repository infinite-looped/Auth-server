//JWT and refresh token creation & validation 
//Validate refresh token
//Rotate refresh tokens
//Issue new access tokens
//Revoke refresh tokens (logout / logout-all)

const RefreshToken = require("../models/RefreshToken.model");
const { hashToken, generateRandomToken } = require("../utils/crypto.util");
const { signAccessToken } = require("../utils/jwt.util");

//Refresh access token using refresh token (rotation)
const refreshAccessToken = async (rawRefreshToken) => {
    if(!rawRefreshToken) {
        const err = new Error("Refresh token missing");
        err.statusCode = 401;
        throw err;
    }
    const refreshTokenHash = hashToken(rawRefreshToken);
    const existingToken = await RefreshToken.findOne({
        tokenHash: refreshTokenHash,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
    })

    if(!existingToken) {
        //possible token reuse attack
        const err = new Error("Invalid or expired refresh token");
        err.statusCode = 401;
        throw err;
    }
 //Rotate refresh token
    existingToken.isRevoked = true;
    await existingToken.save();

    const newRefreshToken = generateRandomToken();
    const newRefreshTokenHash = hashToken(newRefreshToken);

    await RefreshToken.create({
        userId: existingToken.userId,
        tokenHash: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
 // Issue new access token 
    const accessToken  = signAccessToken({
        sub: existingToken.userId,
    });
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};
//Logout (revoke single refresh token)
const revokeRefreshToken = async (rawRefreshToken) => {
    if (!rawRefreshToken) return;
    const refreshTokenHash = hashToken(rawRefreshToken);
    await RefreshToken.updateOne(
        { tokenHash: refreshTokenHash },
        { isRevoked: true }
    );
};

//Logout from all devices
const revokeAllRefreshTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

module.exports = {
    refreshAccessToken,
    revokeRefreshToken,
    revokeAllRefreshTokens,
};
