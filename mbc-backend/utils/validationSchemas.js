// utils/validationSchemas.js
import Joi from 'joi';

// Schema for creating a new student
export const createStudentSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    scholarNo: Joi.string().required(),
    mobile: Joi.string().optional().allow(''),
    branch: Joi.string().hex().length(24).required(), // MongoDB ObjectId
    currentSemester: Joi.number().integer().min(1).max(12).required(),
});

// Schema for updating a student (fields are optional)
export const updateStudentSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    scholarNo: Joi.string(),
    mobile: Joi.string().allow(''),
    branch: Joi.string().hex().length(24),
    currentSemester: Joi.number().integer().min(1).max(12),
});

// Add other schemas for professor, branch, course, etc. following the same pattern.