import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/* Modular payment layer. Razorpay implementation today; swap-friendly interface. */
let client = null;
if (env.razorpay.enabled) {
  client = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });
}

export const paymentService = {
  isEnabled() {
    return env.razorpay.enabled;
  },

  async createOrder({ amount, currency = 'INR', receipt }) {
    if (!client) throw ApiError.badRequest('Payment gateway is not configured');
    // Razorpay expects the amount in the smallest currency unit (paise).
    return client.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
    });
  },

  /* Server-side signature verification. NEVER trust the frontend response alone. */
  verifySignature({ orderId, paymentId, signature }) {
    const expected = crypto
      .createHmac('sha256', env.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    // timing-safe compare
    const a = Buffer.from(expected);
    const b = Buffer.from(signature || '');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  },
};
