import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export function crudController(Model, { label = 'Item', defaultSort = { order: 1, createdAt: -1 }, publicFilter = null } = {}) {
  return {
    listPublic: asyncHandler(async (_req, res) => {
      const items = await Model.find(publicFilter || {}).sort(defaultSort);
      return sendSuccess(res, { data: items });
    }),
    listAll: asyncHandler(async (_req, res) => {
      const items = await Model.find().sort(defaultSort);
      return sendSuccess(res, { data: items });
    }),
    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      return sendSuccess(res, { statusCode: 201, message: `${label} created`, data: item });
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) throw ApiError.notFound(`${label} not found`);
      return sendSuccess(res, { message: `${label} updated`, data: item });
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw ApiError.notFound(`${label} not found`);
      return sendSuccess(res, { message: `${label} deleted` });
    }),
  };
}
