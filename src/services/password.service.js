const User = require("../models/User.model");
const PasswordResetToken = require("../models/PasswordResetToken.model");
const RefreshToken = require("../models/RefreshToken.model");

const { hashPassword } = require("../utils/bcrypt.util");
const { hashToken, generateRandomToken } = require("../utils/crypto.util");
const { sendPasswordResetEmail } = require("./email.service");

/**
 * Generate password reset token and store hashed version
 * @param {string} email
 * @returns {Promise<void>}
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return; 
  //CLEANUP: Delete any existing reset tokens for this user
  await PasswordResetToken.deleteMany({ userId: user._id });

  const rawToken = generateRandomToken();
  const tokenHash = hashToken(rawToken);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
  });

  // Send reset email
  await sendPasswordResetEmail({
    email: user.email,
    resetToken: rawToken,
  });
};

/**
 * Reset user password using valid reset token
 * @param {{ token: string, password: string }} payload
 * @returns {Promise<void>}
 */
const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);

  const resetToken = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!resetToken) {
    const err = new Error("Invalid or expired reset token");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  await User.updateOne(
    { _id: resetToken.userId },
    { password: hashedPassword }
  );

  // Invalidate reset token
  await PasswordResetToken.deleteOne({ _id: resetToken._id });

  // Revoke all refresh tokens
  await RefreshToken.updateMany(
    { userId: resetToken.userId },
    { isRevoked: true }
  );
};

module.exports = {
  forgotPassword,
  resetPassword,
};
