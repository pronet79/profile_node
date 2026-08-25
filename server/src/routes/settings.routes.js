import { Router } from 'express';
import * as ctrl from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { settingsSchema } from '../validators/schemas.js';

const router = Router();
router.get('/', ctrl.getPublic);
router.put('/', protect, validate(settingsSchema), ctrl.update);
export default router;
