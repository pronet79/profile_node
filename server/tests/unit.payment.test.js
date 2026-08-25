import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';
import './setup.env.js';

const SECRET = 'rzp_test_secret';
let paymentService;
beforeAll(async () => { ({ paymentService } = await import('../src/services/payment.service.js')); });

function realSignature(orderId, paymentId) {
  return crypto.createHmac('sha256', SECRET).update(`${orderId}|${paymentId}`).digest('hex');
}

describe('paymentService.verifySignature', () => {
  it('accepts a correctly-computed signature', () => {
    const sig = realSignature('order_1', 'pay_1');
    expect(paymentService.verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: sig })).toBe(true);
  });

  it('rejects a forged/incorrect signature', () => {
    expect(paymentService.verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: 'deadbeef' })).toBe(false);
  });

  it('rejects when the signature is missing', () => {
    expect(paymentService.verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: '' })).toBe(false);
  });

  it('rejects when order/payment ids are tampered after signing', () => {
    const sig = realSignature('order_1', 'pay_1');
    expect(paymentService.verifySignature({ orderId: 'order_2', paymentId: 'pay_1', signature: sig })).toBe(false);
  });

  it('reports enabled when keys are configured', () => {
    expect(paymentService.isEnabled()).toBe(true);
  });
});
