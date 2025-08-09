// mbc-backend/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importing routes
import authRoutes from './routes/authRoute.js';

// Teacher and Student routes
import teacherRoutes from './routes/professorRoute.js';
import studentRoutes from './routes/studentRoute.js';

// Assignment and Marks routes
import assignmentRoutes from './routes/assignmentRoute.js';
import marksRoutes from './routes/marksRoute.js';
import path from "path";
import noticeRoutes from './routes/noticeRoute.js';
import attendanceRoutes from './routes/attendenceRoute.js';

// Analytics and Dashboard routes
import analyticsRoutes from './routes/analytics.js';
import teacherDashboardRoutes from './routes/teacherDashboard.js';
import studentDashboardRoutes from './routes/studentDashboard.js';

// ... other routes

dotenv.config();
const app = express();

// Respect CORS origin from env in production
const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()), credentials: true }
  : {};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);


app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/api/assignments', assignmentRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);

// Notice route
app.use('/api/notices', noticeRoutes);


// Analytics route
app.use('/api/analytics', analyticsRoutes);
app.use('/api/student-dashboard', studentDashboardRoutes);
app.use('/api/teacher-dashboard', teacherDashboardRoutes);
       
// ... other routes

export default app;
