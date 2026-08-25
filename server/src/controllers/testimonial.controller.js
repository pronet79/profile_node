import crypto from 'crypto';
import { Testimonial } from '../models/Testimonial.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { emailService } from '../services/email.service.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip || '').digest('hex');

// PUBLIC — only approved
export const listApproved = asyncHandler(async (_req, res) => {
  const items = await Testimonial.find({ status: 'approved' })
    .select('name company website rating message avatar createdAt')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { data: items });
});

// PUBLIC — submit (goes to pending)
export const submit = asyncHandler(async (req, res) => {
  const ipHash = hashIp(req.ip);
  // Duplicate protection: same email + message within 24h
  const dupe = await Testimonial.findOne({
    email: req.body.email,
    message: req.body.message,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (dupe) throw ApiError.conflict('You have already submitted this feedback.');

  const t = await Testimonial.create({ ...req.body, status: 'pending', ipHash });
  emailService.notifyNewTestimonial(t); // fire-and-forget
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Thank you! Your feedback has been submitted for review.',
    data: { id: t._id },
  });
});

// ADMIN
export const listAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await Testimonial.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, { data: items });
});

export const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) throw ApiError.badRequest('Invalid status');
  const t = await Testimonial.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!t) throw ApiError.notFound('Testimonial not found');
  return sendSuccess(res, { message: `Testimonial ${status}`, data: t });
});

export const remove = asyncHandler(async (req, res) => {
  const t = await Testimonial.findByIdAndDelete(req.params.id);
  if (!t) throw ApiError.notFound('Testimonial not found');
  return sendSuccess(res, { message: 'Testimonial deleted' });
});
