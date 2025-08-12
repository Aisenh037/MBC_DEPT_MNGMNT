// models/student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  scholarNo: { type: String, unique: true, required: [true, 'Scholar Number is required'], trim: true },
  mobile: { type: String, trim: true },
  Email: { type: String, trim: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  currentSemester: { type: Number, min: 1, max: 12, required: true },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);