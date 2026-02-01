// Password reset related routes

const express = require("express");
const router = express.Router();

const { globalRateLimiter } = require("../middleware/rateLimit.middleware");
const {
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/password.controller");

const validate = require("../middleware/validate.middleware");
const bruteForceMiddleware = require("../middleware/bruteForce.middleware");

const {
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/password.schema");

/**
 * POST /auth/forgot-password
 * Request password reset link
 * Brute-force protected
 */
router.post(
  "/forgot-password",
  globalRateLimiter,
  validate(forgotPasswordSchema),
  bruteForceMiddleware, 
  forgotPasswordController
);

/**
 * POST /auth/reset-password
 * Reset password using token
 */
router.post(
  "/reset-password",
  globalRateLimiter,
  validate(resetPasswordSchema),
  resetPasswordController
);

module.exports = router;
