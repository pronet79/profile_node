import dotenv from 'dotenv';
dotenv.config();

function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) {
    // Don't throw for optional integrations; only warn.
    console.warn(`[env] Missing environment variable: ${name}`);
  }
  return v;
}

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/portfolio'),
  jwtSecret: required('JWT_SECRET', 'dev_insecure_secret_change_me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    adminNotify: process.env.ADMIN_NOTIFY_EMAIL || '',
    enabled: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'portfolio',
    enabled: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
    ),
  },
  // Public origin of the API itself, used to build absolute URLs for
  // locally-stored uploads and for the sitemap. Falls back to localhost.
  publicUrl: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || '5000'}`,
  // Public origin of the deployed site (used in <loc> entries of the sitemap).
  siteUrl: process.env.SITE_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
  seed: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    name: process.env.ADMIN_NAME || 'Pradosh Mukherjee',
  },
};
