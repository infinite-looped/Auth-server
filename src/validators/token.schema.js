const { z } = require("zod");

/**
 * Refresh token request
 */
const refreshTokenSchema = z.object({});

/**
 * Logout request
 */
const logoutSchema = z.object({});

module.exports = {
  refreshTokenSchema,
  logoutSchema,
};
