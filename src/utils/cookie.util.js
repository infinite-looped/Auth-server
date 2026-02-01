//Secure HTTP-only cookie helpers
//tells the browser to store the refreshToken as a cookie.
const { env } = require("../config/env.config");

//Set refresh token in HTTP-only secure cookie
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

//Clear refresh token cookie(Removes the refresh token from the browser)
const clearRefreshTokenCookie = (res) => {
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",       
    });
};

module.exports = {
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
}
