/**
 * @fileoverview Controller for OAuth routes
 * @module controllers/oauth
 */

const {
  initiateOAuthLogin,
  handleOAuthCallback,
} = require("../services/oauth/oauth.service");

const { setRefreshTokenCookie } = require("../utils/cookie.util");

/**
 * Initiates Google OAuth login
 * GET /auth/oauth/google
 */
const googleLoginController = async (req, res, next) => {
  try {
    const { url, state } = await initiateOAuthLogin("google");

    // Store OAuth state (CSRF protection)
    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.redirect(url);
  } catch (err) {
    next(err);
  }
};

/**
 * Handles Google OAuth callback
 * GET /auth/oauth/google/callback
 */
const googleCallbackController = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;

    // CSRF protection
    if (!state || state !== savedState) {
      return res.status(403).json({
        message: "Invalid OAuth state.",
      });
    }

    res.clearCookie("oauth_state");

    const { refreshToken } = await handleOAuthCallback({
      provider: "google",
      code,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // Set refresh token cookie using shared util
    setRefreshTokenCookie(res, refreshToken);

    // Redirect back to frontend
    res.redirect(
     `${process.env.CLIENT_URL}/oauth-success`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  googleLoginController,
  googleCallbackController,
};
