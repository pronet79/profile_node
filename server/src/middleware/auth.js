import { verifyToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Admin } from '../models/Admin.js';

/* Reads JWT from HttpOnly cookie or Authorization header. */
export const protect = asyncHandler(async (req, _res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) throw ApiError.unauthorized('Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired session');
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin) throw ApiError.unauthorized('Account no longer exists');
  req.admin = admin;
  next();
});
