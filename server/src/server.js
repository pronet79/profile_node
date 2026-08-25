import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function start() {
  await connectDB(env.mongoUri);
  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
    if (!env.razorpay.enabled) logger.warn('Razorpay not configured — donation flow will be disabled.');
    if (!env.smtp.enabled) logger.warn('SMTP not configured — emails will be skipped.');
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down.`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
