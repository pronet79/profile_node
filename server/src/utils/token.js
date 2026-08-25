import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}
