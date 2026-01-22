const { z } = require("zod");

/**
 * Forgot password request
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
});

/**
 * Reset password request
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character"),
});

module.exports = {
  forgotPasswordSchema,
  resetPasswordSchema,
};
