import { Router } from 'express';
import ctrl from '../controllers/experience.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { experienceSchema } from '../validators/schemas.js';

const router = Router();
router.get('/', ctrl.listPublic);
router.get('/admin/all', protect, ctrl.listAll);
router.post('/', protect, validate(experienceSchema), ctrl.create);
router.put('/:id', protect, validate(experienceSchema), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
export default router;
