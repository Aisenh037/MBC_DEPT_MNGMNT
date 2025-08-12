// models/token.js
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: ['reset', 'otp'], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema);
