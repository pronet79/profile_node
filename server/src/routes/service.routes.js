import { Router } from 'express';
import ctrl from '../controllers/service.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { serviceSchema } from '../validators/schemas.js';

const router = Router();
router.get('/', ctrl.listPublic);
router.get('/admin/all', protect, ctrl.listAll);
router.post('/', protect, validate(serviceSchema), ctrl.create);
router.put('/:id', protect, validate(serviceSchema), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
export default router;
