import rateLimit from 'express-rate-limit';

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message, errors: [] },
  });

export const generalLimiter = make(15, 300, 'Too many requests, please try again later.');
export const authLimiter = make(15, 10, 'Too many login attempts, please try again later.');
export const publicFormLimiter = make(60, 8, 'Too many submissions, please slow down.');
export const paymentLimiter = make(15, 20, 'Too many payment attempts, please try again later.');
