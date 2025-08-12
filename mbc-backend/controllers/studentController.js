// controllers/studentController.js
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Student from '../models/student.js';
import csv from 'fast-csv';
import {
  createStudentAndUser,
  updateStudentAndUser,
  deleteStudentAndUser,
  sendPasswordResetLink,
  exportStudentsToCsv,
} from '../services/studentService.js';

// @desc    Get all students
// @route   GET /api/students
export const getStudents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Add a single student
// @route   POST /api/students
export const addStudent = asyncHandler(async (req, res, next) => {
  const student = await createStudentAndUser(req.body);
  res.status(201).json({ success: true, data: student });
});

// @desc    Update a student
// @route   PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res, next) => {
  const student = await updateStudentAndUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: student });
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
export const deleteStudent = asyncHandler(async (req, res, next) => {
  await deleteStudentAndUser(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

// @desc    Send password reset link
// @route   POST /api/students/:id/send-reset-link
export const sendResetLink = asyncHandler(async (req, res, next) => {
    await sendPasswordResetLink(req.params.id);
    res.status(200).json({ success: true, message: 'Password reset link sent successfully.' });
});

// @desc    Bulk import students from a CSV file
// @route   POST /api/students/bulk-import
export const bulkImportStudents = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a CSV file.', 400));
    }

    const results = [];
    const errors = [];
    
    const stream = csv.parse({ headers: true })
        .on('error', error => next(new ErrorResponse(error.message, 400)))
        .on('data', row => results.push(row))
        .on('end', async (rowCount) => {
            for (const studentData of results) {
                try {
                    // Use your service to create each student. This ensures consistency.
                    await createStudentAndUser(studentData);
                } catch (error) {
                    errors.push(`Error on row for ${studentData.email || 'unknown'}: ${error.message}`);
                }
            }
            res.status(200).json({
                success: true,
                message: `Processed ${rowCount} rows.`,
                successfulImports: results.length - errors.length,
                errors: errors,
            });
        });

    stream.write(req.file.buffer);
    stream.end();
});

// @desc    Export students to a CSV file
// @route   GET /api/students/bulk-export
export const bulkExport = asyncHandler(async (req, res, next) => {
    const csvData = await exportStudentsToCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csvData);
});