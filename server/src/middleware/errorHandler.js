import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let error = err;

  // Normalize common Mongoose errors into ApiError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, 'Validation failed', errors);
  } else if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}`);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(409, `Duplicate value for ${field}`);
  } else if (!(err instanceof ApiError)) {
    error = new ApiError(500, err.message || 'Internal server error');
  }

  if (error.statusCode >= 500) logger.error(`${error.message}\n${err.stack}`);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}
