import { Router } from 'express';
import * as ctrl from '../controllers/legal.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { legalSchema } from '../validators/schemas.js';

const router = Router();
router.get('/admin/all', protect, ctrl.listAll);      // admin list (before :slug)
router.get('/:slug', ctrl.getBySlug);                  // public single page
router.put('/:slug', protect, validate(legalSchema), ctrl.upsert); // admin upsert
export default router;
