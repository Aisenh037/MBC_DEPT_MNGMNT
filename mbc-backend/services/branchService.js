// services/branchService.js
import Branch from '../models/Branch.js';
import Student from '../models/student.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * Creates a new academic branch.
 * @param {object} branchData - The data for the new branch.
 * @returns {Promise<Branch>}
 */
export const createNewBranch = async (branchData) => {
  return Branch.create(branchData);
};

/**
 * Deletes a branch and ensures no students are still assigned to it.
 * @param {string} branchId - The ID of the branch to delete.
 */
export const deleteBranchById = async (branchId) => {
    const studentCount = await Student.countDocuments({ branch: branchId });
    if (studentCount > 0) {
        throw new ErrorResponse(`Cannot delete branch. ${studentCount} students are still assigned to it.`, 400);
    }
    
    const branch = await Branch.findByIdAndDelete(branchId);
    if (!branch) {
        throw new ErrorResponse(`Branch not found with id of ${branchId}`, 404);
    }
};