// utils/tokenHelpers.js
import crypto from 'crypto';
import Token from '../models/token.js';

// Hashes the raw token before it's stored
const hashToken = (raw) => {
  return crypto.createHash('sha256').update(raw).digest('hex');
};

// Creates and saves a token document (for OTP or password reset)
export const createToken = async ({ userId, type = 'reset', ttlMinutes = 60 }) => {
  // Generate a cryptographically secure random string for the raw token
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = hashToken(raw);

  await Token.create({
    user: userId,
    token: hashed,
    type,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
  });

  // Return the raw token ONLY ONCE to be used in the email link
  return { raw };
};

// Verifies a raw reset token from a URL against the hashed version in the DB
export const verifyResetToken = async (raw) => {
  const hashed = hashToken(raw);
  const tokenDoc = await Token.findOne({
    token: hashed,
    type: 'reset',
    used: false,
    expiresAt: { $gt: new Date() } // Ensure token has not expired
  });
  return tokenDoc;
};