// controllers/professorController.js
import asyncHandler from '../middleware/asyncHandler.js';
import { createProfessorAndUser, updateProfessorAndUser } from '../services/professorService.js';
import Professor from '../models/professor.js'; // Still needed for get/delete

// @desc    Get all teachers
export const getTeachers = asyncHandler(async (req, res, next) => {
  const teachers = await Professor.find().populate('user', 'name email').populate('branches', 'name');
  res.status(200).json({ success: true, count: teachers.length, data: teachers });
});

// @desc    Add a new teacher
export const addTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await createProfessorAndUser(req.body);
  res.status(201).json({ success: true, data: teacher });
});

// @desc    Update a teacher
export const updateTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await updateProfessorAndUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: teacher });
});

// @desc    Delete a teacher
export const deleteTeacher = asyncHandler(async (req, res, next) => {
    // Note: For a true enterprise app, deleting a user is rare.
    // Usually, you would deactivate them instead.
    const professor = await Professor.findById(req.params.id);
    if (!professor) {
        return next(new ErrorResponse(`Professor not found`, 404));
    }
    // Simple deletion for now, but a service with transactions would be better
    await User.findByIdAndDelete(professor.user);
    await professor.remove();
    res.status(200).json({ success: true, data: {} });
});