import crypto from 'crypto';
import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { emailService } from '../services/email.service.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip || '').digest('hex');

export const submit = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create({ ...req.body, ipHash: hashIp(req.ip) });
  emailService.notifyNewContact(msg);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Thanks! I'll review your project and get back to you.",
    data: { id: msg._id },
  });
});

export const listAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    filter.$or = [
      { name: new RegExp(req.query.q, 'i') },
      { email: new RegExp(req.query.q, 'i') },
      { message: new RegExp(req.query.q, 'i') },
    ];
  }
  const items = await ContactMessage.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, { data: items });
});

export const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['new', 'read', 'replied', 'archived'].includes(status)) throw ApiError.badRequest('Invalid status');
  const m = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!m) throw ApiError.notFound('Message not found');
  return sendSuccess(res, { message: `Marked ${status}`, data: m });
});

export const remove = asyncHandler(async (req, res) => {
  const m = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!m) throw ApiError.notFound('Message not found');
  return sendSuccess(res, { message: 'Message deleted' });
});
