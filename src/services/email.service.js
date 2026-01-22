const nodemailer = require("nodemailer");

/**
 * Create reusable email transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send password reset email
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.resetToken
 */
const sendPasswordResetEmail = async ({ email, resetToken }) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    text: `Reset your password using the link below:\n\n${resetLink}`,
    html: `
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetLink}">Click here to reset your password</a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
};
