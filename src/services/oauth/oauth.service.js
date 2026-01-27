/**
 * @fileoverview OAuth orchestration service.
 * Handles OAuth login flow integration with the local auth system.
 *
 * Responsibilities:
 *  - Initiate OAuth login (generate URL + state)
 *  - Handle OAuth callback
 *  - Create or find local user
 *  - Issue access & refresh tokens
 *
 * @module services/oauth
 */

const User = require("../../models/User.model");
const RefreshToken = require("../../models/RefreshToken.model");

const {
  generateState,
  getGoogleAuthUrl,
  getGoogleUser,
} = require("../oauth/google.service");

const { signAccessToken } = require("../../utils/jwt.util");
const { generateRandomToken, hashToken } = require("../../utils/crypto.util");

/**
 * Initiates OAuth login for Google.
 * Generates state and authorization URL.
 *
 * @param {string} provider - OAuth provider name (only "google" supported)
 * @returns {Promise<{url: string, state: string}>}
 */
const initiateOAuthLogin = async (provider) => {
  if (provider !== "google") {
    const err = new Error("Unsupported OAuth provider");
    err.statusCode = 400;
    throw err;
  }

  const state = generateState();
  const url = getGoogleAuthUrl(state);

  return { url, state };
};

/**
 * Handles OAuth callback and integrates user into local auth system.
 *
 * Flow:
 *  1. Fetch user data from Google
 *  2. Find or create local user
 *  3. Issue JWT access token
 *  4. Issue refresh token and store hashed version
 *
 * @param {Object} payload
 * @param {string} payload.provider - OAuth provider ("google")
 * @param {string} payload.code - Authorization code from Google
 * @param {string} payload.userAgent - Client user-agent
 * @param {string} payload.ipAddress - Client IP address
 *
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
const handleOAuthCallback = async ({
  provider,
  code,
  userAgent,
  ipAddress,
}) => {
  if (provider !== "google") {
    const err = new Error("Unsupported OAuth provider");
    err.statusCode = 400;
    throw err;
  }

  // 1. Fetch user info from Google
  const oauthUser = await getGoogleUser(code);

  // 2. Find or create local user
  let user = await User.findOne({ email: oauthUser.email });

  if (!user) {
    user = await User.create({
      email: oauthUser.email,
      password: null, // OAuth users do not have local passwords
      roles: ["USER"],
      isEmailVerified: true,
    });
  }

  // 3. Issue access token (JWT)
  const accessToken = signAccessToken({
    sub: user._id,
    roles: user.roles,
  });

  // 4. Issue refresh token
  const refreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent,
    ipAddress,
  });

  return { accessToken, refreshToken };
};

module.exports = {
  initiateOAuthLogin,
  handleOAuthCallback,
};
