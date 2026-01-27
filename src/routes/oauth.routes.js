/**
 * @fileoverview OAuth authentication routes.
 * @module routes/oauth
 *
 * Base path: /auth/oauth
 *
 * Routes:
 *  - GET /auth/oauth/google
 *      Initiates Google OAuth login by redirecting user
 *
 *  - GET /auth/oauth/google/callback
 *      Handles Google OAuth callback and completes authentication
 */

const express = require("express");
const router = express.Router();

const {
  googleLoginController,
  googleCallbackController,
} = require("../controllers/oauth.controller");

/**
 * Initiate Google OAuth login
 * Redirects user to Google consent screen
 *
 * @route GET /auth/oauth/google
 * @returns {void} Redirect response
 */
router.get("/google", googleLoginController);

/**
 * Google OAuth callback endpoint
 * Handles OAuth redirect from Google
 *
 * @route GET /auth/oauth/google/callback
 * @returns {void} Redirects user to frontend with access token
 */
router.get("/google/callback", googleCallbackController);

module.exports = router;
