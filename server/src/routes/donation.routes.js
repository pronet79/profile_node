import { Router } from 'express';
import * as ctrl from '../controllers/donation.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paymentLimiter } from '../middleware/rateLimiters.js';
import { donationOrderSchema, donationVerifySchema } from '../validators/schemas.js';

const router = Router();
// public
router.post('/order', paymentLimiter, validate(donationOrderSchema), ctrl.createOrder);
router.post('/verify', paymentLimiter, validate(donationVerifySchema), ctrl.verifyPayment);
router.get('/supporters', ctrl.listPublicSupporters);
// admin
router.get('/admin/all', protect, ctrl.listAll);
router.get('/admin/stats', protect, ctrl.stats);
export default router;
