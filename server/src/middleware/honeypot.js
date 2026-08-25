import { ApiError } from '../utils/ApiError.js';

/* If the hidden honeypot field is filled, it is almost certainly a bot.
   We respond with a generic success-like error to avoid tipping off bots. */
export const honeypot = (fieldName = 'website_hp') => (req, _res, next) => {
  if (req.body && req.body[fieldName]) {
    return next(new ApiError(400, 'Submission rejected'));
  }
  if (req.body) delete req.body[fieldName];
  next();
};
