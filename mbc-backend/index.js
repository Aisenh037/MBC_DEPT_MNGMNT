// backend/index.js
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

//This MUST be at the very top of the file.
// It checks your NODE_ENV and loads the correct environment file before anything else.
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// --- Application Imports (Now it's safe to import them) ---
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import seedAdmin from "./config/seedAdmin.js";
import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

// --- Main Server Startup Logic ---
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.SEED_ADMIN === 'true') {
      await seedAdmin();
    }
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // --- Graceful Shutdown Handler ---
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        mongoose.connection.close(false).then(() => {
          logger.info('MongoDB connection closed. Exiting process.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();