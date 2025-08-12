// models/professor.js
import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  teacherId: { type: String, unique: true, required: [true, 'Teacher ID is required'], trim: true },

  // A professor can now be associated with multiple branches
  branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  mobile: { type: String, trim: true },
  Email: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Professor', professorSchema);