// app.js — Main Entry Point of the Backend
// Purpose: Configure middleware, connect routes, and set up security for our API.

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Utilities
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';

// Routes (Modularized — Separation of Concerns)
import authRoutes from './routes/authRoute.js';
import usersRoutes from './routes/usersRouter.js';
import professorsRoutes from './routes/professorRoute.js';
import studentRoutes from './routes/studentRoute.js';
import subjectRoutes from './routes/subjectRoute.js';
import branchRoutes from './routes/brancheRoute.js';
import assignmentRoutes from './routes/assignmentRoute.js';
import marksRoutes from './routes/marksRoute.js';
import attendanceRoutes from './routes/attendenceRoute.js';
import noticeRoutes from './routes/noticeRoute.js';
import analyticsRoutes from './routes/analytics.js';
import studentDashboardRoutes from './routes/studentDashboard.js';
import teacherDashboardRoutes from './routes/teacherDashboard.js';

// Load environment variables
dotenv.config();

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App
const app = express();

// Trust proxy headers (important for hosting services like Render/Heroku)
app.set('trust proxy', 1);

/* ==========================
   GLOBAL MIDDLEWARE
   ========================== */

// Parse incoming JSON requests
app.use(express.json());

// Parse cookies from request headers
app.use(cookieParser());

// Log requests in development mode (good for debugging)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: logger.stream }));
}

/* ==========================
   SECURITY MIDDLEWARE
   ========================== */
// These protect against common web vulnerabilities
app.use(helmet());             // Sets secure HTTP headers
app.use(xss());                // Prevents Cross-site Scripting (XSS) attacks
app.use(mongoSanitize());      // Prevents MongoDB operator injection
app.use(hpp());                // Prevents HTTP Parameter Pollution

// Enable CORS (Cross-Origin Resource Sharing)
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : true,
  credentials: true, // Allow sending cookies across domains
};
app.use(cors(corsOptions));

// Limit repeated requests to API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,                 // max requests per IP
  message: 'Too many requests from this IP. Please try again later.',
});
app.use('/api', limiter);

/* ==========================
   STATIC FILES
   ========================== */
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

/* ==========================
   API ROUTES
   ========================== */
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/professors`, professorsRoutes);
app.use(`${API_PREFIX}/students`, studentRoutes);
app.use(`${API_PREFIX}/subjects`, subjectRoutes);
app.use(`${API_PREFIX}/branches`, branchRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
app.use(`${API_PREFIX}/marks`, marksRoutes);
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/notices`, noticeRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/dashboards/student`, studentDashboardRoutes);
app.use(`${API_PREFIX}/dashboards/teacher`, teacherDashboardRoutes);

/* ==========================
   HEALTH CHECK
   ========================== */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running smoothly 🚀',
  });
});

/* ==========================
   404 HANDLER
   ========================== */
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  next();
});

/* ==========================
   GLOBAL ERROR HANDLER
   ========================== */
// This will catch all errors from the routes/middleware
app.use(errorHandler);

export default app;
