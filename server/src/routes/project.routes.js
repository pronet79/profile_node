import { Router } from 'express';
import * as ctrl from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { projectSchema } from '../validators/schemas.js';

const router = Router();
// public
router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getBySlug);
// admin
router.get('/admin/all', protect, ctrl.listAll);
router.post('/', protect, validate(projectSchema), ctrl.create);
router.put('/:id', protect, validate(projectSchema), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
export default router;
