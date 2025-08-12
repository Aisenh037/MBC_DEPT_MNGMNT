// services/professorService.js
import mongoose from 'mongoose';
import Professor from '../models/professor.js';
import User from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * Creates a new professor and their user account atomically.
 * @param {object} professorData - The data for the new professor.
 * @returns {Promise<Professor>}
 */
export const createProfessorAndUser = async (professorData) => {
  const { name, email, password, teacherId, branches, mobile } = professorData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new ErrorResponse('User with this email already exists', 400);

    const existingProfessor = await Professor.findOne({ teacherId }).session(session);
    if (existingProfessor) throw new ErrorResponse('Professor with this Teacher ID already exists', 400);

    const user = (await User.create([{ name, email, password, role: 'professor' }], { session }))[0];
    const professor = (await Professor.create([{ user: user._id, teacherId, branches, mobile }], { session }))[0];

    await session.commitTransaction();
    return professor;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Updates a professor's details and their linked user account.
 * @param {string} professorId - The ID of the professor to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<Professor>}
 */
export const updateProfessorAndUser = async (professorId, updateData) => {
    const { name, email, ...professorFields } = updateData;

    const professor = await Professor.findById(professorId);
    if (!professor) throw new ErrorResponse('Professor not found', 404);

    Object.assign(professor, professorFields);
    await professor.save();

    if (name || email) {
        const user = await User.findById(professor.user);
        if (!user) throw new ErrorResponse('Associated user not found', 404);
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
    }
    
    return professor.populate('user');
};