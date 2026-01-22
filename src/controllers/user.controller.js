/**
 * User controller
 * Handles authenticated user-related actions
 */

/**
 * Get current authenticated user
 * GET /auth/me
 */
const getCurrentUserController = async (req, res, next) => {
  try {
    // req.user is set by auth.middleware.js
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentUserController,
};
