import { describe, it, expect, vi } from 'vitest';
import { honeypot } from '../src/middleware/honeypot.js';
import { validate } from '../src/middleware/validate.js';
import { z } from 'zod';

describe('honeypot middleware', () => {
  it('rejects when the honeypot field is filled', () => {
    const next = vi.fn();
    honeypot('website_hp')({ body: { website_hp: 'bot' } }, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });
  it('passes and strips the field when empty', () => {
    const next = vi.fn();
    const req = { body: { name: 'real', website_hp: '' } };
    honeypot('website_hp')(req, {}, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).not.toHaveProperty('website_hp');
  });
});

describe('validate middleware', () => {
  const schema = z.object({ n: z.number() });
  it('passes valid input and replaces body with parsed data', () => {
    const next = vi.fn();
    const req = { body: { n: 5 } };
    validate(schema)(req, {}, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ n: 5 });
  });
  it('forwards an ApiError on invalid input', () => {
    const next = vi.fn();
    validate(schema)({ body: { n: 'x' } }, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });
});
