import { Router } from 'express';
import * as ctrl from '../controllers/contact.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { honeypot } from '../middleware/honeypot.js';
import { publicFormLimiter } from '../middleware/rateLimiters.js';
import { contactSchema } from '../validators/schemas.js';

const router = Router();
router.post('/', publicFormLimiter, honeypot(), validate(contactSchema), ctrl.submit);
// admin
router.get('/admin/all', protect, ctrl.listAll);
router.patch('/:id/status', protect, ctrl.setStatus);
router.delete('/:id', protect, ctrl.remove);
export default router;
