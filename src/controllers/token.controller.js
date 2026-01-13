//Refresh token rotation and logout logic

const { refreshAccessToken, revokeRefreshToken, revokeAllRefreshTokens } = require("../services/token.service");
const{ setRefreshTokenCookie, clearRefreshTokenCookie } = require("../utils/cookie.util");

//Refresh access token
const refreshController = async(req, res, next) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        const{ accessToken, refreshToken: newRefreshToken} = await refreshAccessToken(refreshToken);

        // rotate refresh token cookie
        setRefreshTokenCookie(res, newRefreshToken);
        
        res.status(200).json({
            success: true,
            accessToken,
       });

    }catch(err){
        // clear cookie on invalid refresh token
        clearRefreshTokenCookie(res);
        next(err);
    }
};

//Logout (current device)
//POST /auth/logout
const logoutController = async (req, res, next) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        await revokeRefreshToken (refreshToken);
        clearRefreshTokenCookie(res);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }catch(err){

        next(err);
    };
};

//Logout from all devices
//POST /auth/logout-all

const logoutAllController = async (req, res, next) => {
    try{
        const userId = req.user.userId;
        await revokeAllRefreshTokens(userId);
        clearRefreshTokenCookie(res);

        res.status(200).json({
            success: true, 
            message: "logged out from all the devices",
        });
    }catch(err){
        next(err);
    }
};

module.exports = {
    refreshController,
    logoutController,
    logoutAllController,
}