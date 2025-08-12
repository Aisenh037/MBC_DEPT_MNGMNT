// controllers/authController.js
import asyncHandler from '../middleware/asyncHandler.js';
import { authenticateUser, initiatePasswordReset, resetUserPassword } from '../services/authService.js';
import sendTokenResponse from '../utils/sendTokenResponse.js'; // We'll use a dedicated utility for the response

// @desc    Login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { token, user } = await authenticateUser(email, password);
  sendTokenResponse(user, 200, res, token); // Standardized token response
});

// @desc    Forgot Password (Initiate Reset)
export const forgotPassword = asyncHandler(async (req, res, next) => {
    await initiatePasswordReset(req.body.email);
    res.status(200).json({ success: true, data: 'If a user with that email exists, a reset link has been sent.' });
});

// @desc    Reset Password (Finalize)
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    await resetUserPassword(resetToken, password);
    res.status(200).json({ success: true, data: 'Password has been reset successfully.' });
});