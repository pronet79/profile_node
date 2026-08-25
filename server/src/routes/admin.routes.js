import { Router } from 'express';
import * as dashboard from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/overview', protect, dashboard.overview);
export default router;
