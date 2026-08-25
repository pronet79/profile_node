import { BlogPost } from '../models/BlogPost.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const listPublic = asyncHandler(async (req, res) => {
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  const posts = await BlogPost.find(filter)
    .select('title slug excerpt coverImage category tags publishedAt readMinutes')
    .sort({ publishedAt: -1 });
  return sendSuccess(res, { data: posts });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!post) throw ApiError.notFound('Post not found');
  return sendSuccess(res, { data: post });
});

export const listAll = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  return sendSuccess(res, { data: posts });
});

export const create = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Post created', data: post });
});

export const update = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) throw ApiError.notFound('Post not found');
  return sendSuccess(res, { message: 'Post updated', data: post });
});

export const remove = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  return sendSuccess(res, { message: 'Post deleted' });
});
