// middleware/auth.js
import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';  
import User from '../models/user.js';  

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Optional: Check for token in cookies as a fallback
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

   // Ensure JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    return next(new ErrorResponse('JWT_SECRET is not set in environment variables', 500));
  }



  try {
    // Verify token and then find the user from the database
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        return next(new ErrorResponse('No user found with this id', 404));
    }
    
    next();
  } catch (err) {
    // This will catch expired tokens, malformed tokens, etc.
    // Handle JWT-specific errors
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token has expired, please log in again', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token, authentication failed', 401));
    }

    // Generic fallback
    return next(new ErrorResponse('Not authorized, token verification failed', 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role '${req.user?.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};



export default protect;