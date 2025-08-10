// routes/studentRoute.js
import express from 'express';
import { getStudents, addStudent, updateStudent, deleteStudent, bulkImportStudents } from '../controllers/studentController.js';
import protect from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';
import Student from '../models/student.js';
import advancedResults from '../middleware/advancedResults.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(requireRole('admin', 'professor'), advancedResults(Student, ['user','branch','hostel']), getStudents)
    .post(requireRole('admin'), addStudent);

router.route('/:id')
    .put(requireRole('admin'), updateStudent)
    .delete(requireRole('admin'), deleteStudent);

router.post('/bulk-import', requireRole('admin'), bulkImportStudents);

export default router;