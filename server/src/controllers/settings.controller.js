import { SiteSettings } from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const getPublic = asyncHandler(async (_req, res) => {
  const s = await SiteSettings.getSingleton();
  // strip nothing sensitive here — settings are public-facing site info
  return sendSuccess(res, { data: s });
});

export const update = asyncHandler(async (req, res) => {
  const s = await SiteSettings.getSingleton();
  Object.assign(s, req.body);
  if (req.body.social) Object.assign(s.social, req.body.social);
  if (req.body.seo) Object.assign(s.seo, req.body.seo);
  await s.save();
  return sendSuccess(res, { message: 'Settings updated', data: s });
});
