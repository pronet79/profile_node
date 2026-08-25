import { ApiError } from '../utils/ApiError.js';

/* Validates req.body against a Zod schema, replacing body with parsed data. */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return next(new ApiError(400, 'Validation failed', errors));
  }
  req.body = result.data;
  next();
};
