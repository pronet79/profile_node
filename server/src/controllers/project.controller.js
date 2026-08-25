import { Project } from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// PUBLIC
export const listPublic = asyncHandler(async (req, res) => {
  const filter = { published: true };
  if (req.query.featured === 'true') filter.featured = true;
  const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
  return sendSuccess(res, { data: projects });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!project) throw ApiError.notFound('Project not found');
  return sendSuccess(res, { data: project });
});

// ADMIN
export const listAll = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  return sendSuccess(res, { data: projects });
});

export const create = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Project created', data: project });
});

export const update = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) throw ApiError.notFound('Project not found');
  return sendSuccess(res, { message: 'Project updated', data: project });
});

export const remove = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  return sendSuccess(res, { message: 'Project deleted' });
});
