import { LegalPage } from '../models/LegalPage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const SLUGS = ['privacy', 'terms', 'payment-policy'];

// PUBLIC — get one page by slug (returns null data if it hasn't been created yet)
export const getBySlug = asyncHandler(async (req, res) => {
  if (!SLUGS.includes(req.params.slug)) throw ApiError.notFound('Page not found');
  const page = await LegalPage.findOne({ slug: req.params.slug });
  return sendSuccess(res, { data: page });
});

// ADMIN — list all three (creating any missing ones as empty shells)
export const listAll = asyncHandler(async (_req, res) => {
  const pages = await LegalPage.find({ slug: { $in: SLUGS } });
  return sendSuccess(res, { data: pages });
});

// ADMIN — upsert a page by slug
export const upsert = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!SLUGS.includes(slug)) throw ApiError.badRequest('Invalid page');
  const page = await LegalPage.findOneAndUpdate(
    { slug },
    { $set: { title: req.body.title, content: req.body.content }, $setOnInsert: { slug } },
    { new: true, upsert: true, runValidators: true }
  );
  return sendSuccess(res, { message: 'Page saved', data: page });
});
