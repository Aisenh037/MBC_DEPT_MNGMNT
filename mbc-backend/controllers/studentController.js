// controllers/studentController.js
import Student from '../models/student.js';
import User from '../models/user.js';
import Hostel from '../models/Hostel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getStudents = asyncHandler(async (req, res, next) => {
  // If advancedResults is present, use it; otherwise fallback to a basic query
  if (res.advancedResults) {
    return res.status(200).json(res.advancedResults);
  }
  const students = await Student.find().populate('user').populate('branch').populate('hostel');
  return res.status(200).json({ success: true, count: students.length, data: students });
});

export const addStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, scholarNo, scholarNumber, mobile, branch, currentSemester } = req.body;

  const resolvedScholarNo = scholarNo || scholarNumber;
  if (!resolvedScholarNo) {
    return next(new ErrorResponse('scholarNo or scholarNumber is required', 400));
  }

  // Create or find user
  let user = await User.findOne({ email });
  if (!user) {
    const effectivePassword = password || Math.random().toString(36).slice(-10);
    user = await User.create({ name, email, password: effectivePassword, role: 'student' });
  }

  // Ensure unique scholarNo
  const existing = await Student.findOne({ scholarNo: resolvedScholarNo });
  if (existing) {
    return next(new ErrorResponse('Student with this scholar number already exists', 400));
  }

  const student = await Student.create({ user: user._id, scholarNo: resolvedScholarNo, mobile, branch, currentSemester });
  res.status(201).json({ success: true, data: student });
});

export const updateStudent = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, branch, currentSemester, scholarNo, scholarNumber } = req.body;
  const student = await Student.findById(req.params.id).populate('user');
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (name) student.user.name = name;
  if (email) student.user.email = email;
  await student.user.save();

  if (mobile !== undefined) student.mobile = mobile;
  if (branch !== undefined) student.branch = branch;
  if (currentSemester !== undefined) student.currentSemester = currentSemester;
  if (scholarNo || scholarNumber) student.scholarNo = scholarNo || scholarNumber;

  await student.save();
  res.status(200).json({ success: true, data: student });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }
  await Student.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

export const bulkImportStudents = asyncHandler(async (req, res, next) => {
  const { branchId, semester, students } = req.body || {};
  if (!Array.isArray(students) || !branchId) {
    return next(new ErrorResponse('branchId and students are required', 400));
  }

  const results = { success: 0, errors: [] };
  for (const row of students) {
    try {
      const resolvedScholarNo = row.scholarNo || row.scholarNumber;
      if (!resolvedScholarNo || !row.name || !row.email) {
        results.errors.push(`Row skip (missing required fields)`);
        continue;
      }

      let user = await User.findOne({ email: row.email });
      if (!user) {
        const randomPass = Math.random().toString(36).slice(-10);
        user = await User.create({ name: row.name, email: row.email, password: randomPass, role: 'student' });
      } else {
        user.name = row.name;
        await user.save();
      }

      const studentUpdate = {
        user: user._id,
        scholarNo: resolvedScholarNo,
        mobile: row.mobile,
        branch: branchId,
        currentSemester: parseInt(row.currentSemester) || parseInt(semester),
      };

      if (row.hostelBlock && row.hostelRoom) {
        let hostel = await Hostel.findOne({ block: row.hostelBlock, room: row.hostelRoom });
        if (!hostel) hostel = await Hostel.create({ block: row.hostelBlock, room: row.hostelRoom });
        studentUpdate.hostel = hostel._id;
      }

      const existing = await Student.findOne({ scholarNo: resolvedScholarNo });
      if (existing) {
        await Student.findByIdAndUpdate(existing._id, studentUpdate);
      } else {
        await Student.create(studentUpdate);
      }
      results.success++;
    } catch (err) {
      results.errors.push(err.message);
    }
  }

  res.status(200).json({ success: true, data: results, message: 'Bulk import completed' });
});