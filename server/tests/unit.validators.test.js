import { describe, it, expect } from 'vitest';
import { loginSchema, testimonialSchema, contactSchema, donationOrderSchema } from '../src/validators/schemas.js';

describe('Zod validators', () => {
  it('accepts a valid login', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret1' }).success).toBe(true);
  });
  it('rejects an invalid email in login', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'secret1' }).success).toBe(false);
  });
  it('accepts a valid testimonial and coerces rating bounds', () => {
    const r = testimonialSchema.safeParse({ name: 'Jo', email: 'j@x.com', rating: 5, message: 'Great work overall!' });
    expect(r.success).toBe(true);
  });
  it('rejects a testimonial rating above 5', () => {
    const r = testimonialSchema.safeParse({ name: 'Jo', email: 'j@x.com', rating: 9, message: 'Great work overall!' });
    expect(r.success).toBe(false);
  });
  it('rejects a contact with an unknown project type', () => {
    const r = contactSchema.safeParse({ name: 'Jo', email: 'j@x.com', projectType: 'Spaceship', message: 'Hello there, I need help' });
    expect(r.success).toBe(false);
  });
  it('rejects a donation below the minimum amount', () => {
    const r = donationOrderSchema.safeParse({ amount: 0 });
    expect(r.success).toBe(false);
  });
});
