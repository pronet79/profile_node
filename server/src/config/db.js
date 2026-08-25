import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}
