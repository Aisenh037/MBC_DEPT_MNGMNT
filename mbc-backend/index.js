import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import seedAdmin from "./config/seedAdmin.js";
import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.SEED_ADMIN === 'true') {
      await seedAdmin();
    }

    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on ${HOST}:${PORT}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down server...');
      await mongoose.connection.close();
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown();
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
