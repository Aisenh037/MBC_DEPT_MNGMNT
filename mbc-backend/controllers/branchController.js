// controllers/branchController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Branch from '../models/Branch.js';
import ErrorResponse from '../utils/errorResponse.js';
import { createNewBranch, deleteBranchById } from '../services/branchService.js';

// @desc    Get all branches
export const getBranches = asyncHandler(async (req, res, next) => {
  const branches = await Branch.find().sort({ name: 1 });
  res.status(200).json({ success: true, count: branches.length, data: branches });
});

// @desc    Create a new branch
export const createBranch = asyncHandler(async (req, res, next) => {
  const branch = await createNewBranch(req.body);
  res.status(201).json({ success: true, data: branch });
});

// @desc    Update a branch
export const updateBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!branch) {
    return next(new ErrorResponse(`Branch not found`, 404));
  }
  res.status(200).json({ success: true, data: branch });
});

// @desc    Delete a branch
export const deleteBranch = asyncHandler(async (req, res, next) => {
  await deleteBranchById(req.params.id);
  res.status(200).json({ success: true, data: {} });
});