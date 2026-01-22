/**
 * Password controller
 * Handles forgot-password and reset-password flows
 */

const {
  forgotPassword,
  resetPassword,
} = require("../services/password.service");

/**
 * Forgot password
 * POST /auth/forgot-password
 */
const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    await forgotPassword(email);

    // Always return success (prevents email enumeration)
    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password
 * POST /auth/reset-password
 */
const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await resetPassword({ token, password });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  forgotPasswordController,
  resetPasswordController,
};
