/**
 * @fileoverview OAuth provider configurations.
 * @module config/oauth
 */

/**
 * Google OAuth 2.0 configuration object.
 * @typedef {Object} GoogleConfig
 * @property {string} clientId - Google Client ID from Cloud Console.
 * @property {string} clientSecret - Google Client Secret from Cloud Console.
 * @property {string} callbackUrl - The URI Google redirects back to after auth.
 * @property {string} authUrl - Google's Authorization endpoint.
 * @property {string} tokenUrl - Google's Token exchange endpoint.
 * @property {string} userInfoUrl - Google's User Info (OIDC) endpoint.
 */



module.exports = {
  /** @type {GoogleConfig} */
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
  }
};