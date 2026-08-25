import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/schemas.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', protect, ctrl.me);
export default router;
