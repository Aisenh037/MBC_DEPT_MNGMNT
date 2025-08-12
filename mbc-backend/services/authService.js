// services/authService.js
import User from '../models/user.js';
import Token from '../models/token.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendEmail } from '../utils/mail.js';
import { createToken, verifyResetToken } from '../utils/tokenHelpers.js';

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object} { token, user }
 */
export const authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new ErrorResponse('Please provide an email and password', 400);
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ErrorResponse('Invalid credentials', 401);
  }
  const token = user.getSignedJwtToken(); // We will add this method to the User model
  user.password = undefined;
  return { token, user };
};

/**
 * Initiates the password reset process by sending an email.
 * @param {string} email - The email of the user requesting the reset.
 */
export const initiatePasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        // We don't reveal if the user exists for security reasons
        return;
    }
    const { raw: resetToken } = await createToken({ userId: user._id, type: 'reset', ttlMinutes: 30 });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Your Password Reset Link',
            html: `<h4>Password Reset</h4><p>You are receiving this email because a password reset request was initiated for your account. Please click the link below to reset your password. The link is valid for 30 minutes.</p><a href="${resetUrl}" target="_blank">Reset Password</a>`
        });
    } catch (error) {
        throw new ErrorResponse('Email could not be sent', 500);
    }
};

/**
 * Resets a user's password using a valid reset token.
 * @param {string} resetToken - The raw reset token from the URL.
 * @param {string} newPassword - The user's new password.
 */
export const resetUserPassword = async (resetToken, newPassword) => {
    const tokenDoc = await verifyResetToken(resetToken);
    if (!tokenDoc) {
        throw new ErrorResponse('Invalid or expired token', 400);
    }
    const user = await User.findById(tokenDoc.user);
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    user.password = newPassword;
    await user.save();
    
    // Invalidate the token after use
    await Token.findByIdAndDelete(tokenDoc._id);
};