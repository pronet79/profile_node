import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { storageService } from '../services/storage.service.js';

// Image → Cloudinary (or local dev fallback)
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file provided');
  const result = await storageService.uploadImage(req.file.buffer, req.file.originalname);
  return sendSuccess(res, { statusCode: 201, message: 'Uploaded', data: result });
});

// Document (resume PDF) → always this server's disk
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file provided');
  const result = await storageService.uploadDocument(req.file.buffer, req.file.originalname);
  return sendSuccess(res, { statusCode: 201, message: 'Uploaded', data: result });
});
