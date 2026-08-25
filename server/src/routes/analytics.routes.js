import { Router } from 'express';
import * as ctrl from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.js';
import { publicFormLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/track', publicFormLimiter, ctrl.track); // public, rate-limited
router.get('/summary', protect, ctrl.summary);         // admin
export default router;
