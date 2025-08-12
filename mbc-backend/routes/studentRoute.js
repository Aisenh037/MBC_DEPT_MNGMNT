import express from 'express';
import multer from 'multer';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  bulkImportStudents,
  bulkExport,
  sendResetLink,
  // Optional: getStudent if you implement
} from '../controllers/studentController.js';

import { protect, authorize } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';
import Student from '../models/student.js';

const router = express.Router();

// Setup multer memory storage only if you plan to parse uploaded files for bulk import
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes - user must be authenticated
router.use(protect);

// Authorize only certain roles - keep it tight, add roles as per your policy
router.use(authorize('admin', 'hod', 'professor')); // Adjust roles as per actual access control


// Get all students with filtering/pagination (using advancedResults middleware)
router.route('/')
  .get(advancedResults(Student, ['user', 'branch', 'hostel']), getStudents)
  .post(authorize('admin'), addStudent);  // Only admin can add new student

  
// Bulk import expects JSON data, not files, so if you want file upload parsing, implement separately
router.route('/bulk-import')
  .post(authorize('admin'), bulkImportStudents);

// Export all students as CSV
router.route('/bulk-export')
  .get(authorize('admin'), bulkExport);

// Student by ID routes
router.route('/:id')
  // .get(getStudent) // Implement getStudent controller if you want single student retrieval
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

// Send reset link to student's email
router.post('/:id/send-reset-link', authorize('admin'), sendResetLink);

export default router;
