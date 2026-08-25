import { Router } from 'express';
import * as ctrl from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { blogSchema } from '../validators/schemas.js';

const router = Router();
router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/admin/all', protect, ctrl.listAll);
router.post('/', protect, validate(blogSchema), ctrl.create);
router.put('/:id', protect, validate(blogSchema), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
export default router;
