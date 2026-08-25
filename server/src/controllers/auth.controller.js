import { Admin } from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken, cookieOptions } from '../utils/token.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+passwordHash');
  const ok = admin ? await admin.comparePassword(password) : false;
  if (!admin || !ok) throw ApiError.unauthorized('Invalid email or password');

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signToken({ sub: admin._id.toString(), role: admin.role });
  res.cookie('token', token, cookieOptions());
  return sendSuccess(res, {
    message: 'Logged in',
    data: { token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', cookieOptions());
  return sendSuccess(res, { message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  const a = req.admin;
  return sendSuccess(res, { data: { id: a._id, name: a.name, email: a.email, role: a.role } });
});
