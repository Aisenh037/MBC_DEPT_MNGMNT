// services/studentService.js
import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import Student from '../models/student.js';
import User from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendEmail } from '../utils/mail.js'; // Assuming you have a mail utility
import { createToken, verifyResetToken } from '../utils/tokenHelpers.js';

/**
 * Creates a new student and their associated user account within a transaction.
 * @param {object} studentData - The data for the new student.
 * @returns {Promise<Student>}
 */
export const createStudentAndUser = async (studentData) => {
  const { name, email, password, scholarNo, mobile, branch, currentSemester } = studentData;

  // Start a MongoDB session for an atomic transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if a user or student already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new ErrorResponse('User with this email already exists', 400);

    const existingStudent = await Student.findOne({ scholarNo }).session(session);
    if (existingStudent) throw new ErrorResponse('Student with this scholar number already exists', 400);

    // 1. Create the User document
    const user = (await User.create([{ name, email, password, role: 'student' }], { session }))[0];

    // 2. Create the Student document
    const student = (await Student.create([{ user: user._id, scholarNo, mobile, branch, currentSemester }], { session }))[0];

    // If both succeed, commit the transaction
    await session.commitTransaction();
    
    // You can also send a welcome email here
    // await sendWelcomeEmail(user, password);

    return student;

  } catch (error) {
    // If anything fails, abort the entire transaction
    await session.abortTransaction();
    throw error; // Re-throw the error to be caught by the asyncHandler
  } finally {
    // End the session
    session.endSession();
  }
};

/**
 * Updates a student and their linked user account.
 * @param {string} studentId - The ID of the student to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<Student>}
 */
export const updateStudentAndUser = async (studentId, updateData) => {
    const { name, email, ...studentFields } = updateData;

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ErrorResponse(`Student not found`, 404);
    }

    // Update the student-specific fields
    Object.assign(student, studentFields);
    await student.save();

    // If name or email are provided, update the associated User document
    if (name || email) {
        const user = await User.findById(student.user);
        if (!user) throw new ErrorResponse('Associated user not found', 404);
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
    }
    
    // Return the updated student with populated user info
    return student.populate('user');
};

/**
 * Deletes a student and their associated user account within a transaction.
 * @param {string} studentId - The ID of the student to delete.
 */
export const deleteStudentAndUser = async (studentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const student = await Student.findById(studentId).session(session);
        if (!student) throw new ErrorResponse('Student not found', 404);

        await User.findByIdAndDelete(student.user).session(session);
        await student.remove({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Generates a password reset token and sends a link via email.
 * @param {string} studentId - The ID of the student.
 */
export const sendPasswordResetLink = async (studentId) => {
    const student = await Student.findById(studentId);
    if (!student) throw new ErrorResponse('Student not found', 404);

    const user = await User.findById(student.user);
    if (!user) throw new ErrorResponse('Associated user not found', 404);

    const { raw: resetToken } = await createToken({ userId: user._id, type: 'reset', ttlMinutes: 30 });
    
    // In a real app, this URL would point to your frontend's reset password page
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click this <a href="${resetUrl}">link</a> to reset your password. It will expire in 30 minutes.</p>`,
        });
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new ErrorResponse('Failed to send reset email.', 500);
    }
};

/**
 * Generates a CSV file of all students.
 * @returns {string} - The CSV data as a string.
 */
export const exportStudentsToCsv = async () => {
    const students = await Student.find().populate('user', 'name email').populate('branch', 'name');
    if (!students.length) {
        throw new ErrorResponse('No students to export', 404);
    }
    const fields = [
        { label: 'Scholar No', value: 'scholarNo' },
        { label: 'Name', value: 'user.name' },
        { label: 'Email', value: 'user.email' },
        { label: 'Branch', value: 'branch.name' },
        { label: 'Semester', value: 'currentSemester' },
        { label: 'Mobile', value: 'mobile' },
    ];
    const parser = new Parser({ fields });
    return parser.parse(students);
};