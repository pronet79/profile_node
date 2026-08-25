import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiters.js';
import { sitemap } from './controllers/sitemap.controller.js';
import { storageService } from './services/storage.service.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1); // needed for correct req.ip behind a proxy / for rate limiting

  // Security headers. Allow images/assets to be embedded cross-origin
  // (e.g. locally-served uploads shown on a frontend on another origin).
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS — allow the configured frontend origin with credentials (cookies)
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // NoSQL injection sanitization ($ and . stripped from keys)
  app.use(mongoSanitize());

  // Logging
  if (!env.isProd) app.use(morgan('dev'));

  // Serve locally-stored files at /uploads. Documents (e.g. the resume) are
  // always stored on this server, and images fall back here when Cloudinary
  // isn't configured — so this is always mounted.
  app.use('/uploads', express.static(storageService.localDir()));

  // SEO: dynamic sitemap generated from published content.
  app.get('/sitemap.xml', sitemap);

  // Global rate limit
  app.use('/api', generalLimiter);

  // Routes
  app.use('/api', routes);

  // 404 + error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
