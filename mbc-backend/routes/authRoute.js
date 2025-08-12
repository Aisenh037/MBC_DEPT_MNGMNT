// routes/authRoute.js
import express from 'express';
import { login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;