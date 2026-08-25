import { describe, it, expect, beforeAll } from 'vitest';
import './setup.env.js';

let signToken, verifyToken, cookieOptions;
beforeAll(async () => { ({ signToken, verifyToken, cookieOptions } = await import('../src/utils/token.js')); });

describe('token utils', () => {
  it('round-trips a payload through sign/verify', () => {
    const token = signToken({ sub: 'abc123', role: 'admin' });
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe('abc123');
    expect(decoded.role).toBe('admin');
  });

  it('rejects a tampered token', () => {
    const token = signToken({ sub: 'abc123' });
    expect(() => verifyToken(token + 'x')).toThrow();
  });

  it('produces httpOnly cookie options', () => {
    const opts = cookieOptions();
    expect(opts.httpOnly).toBe(true);
    expect(opts).toHaveProperty('maxAge');
  });
});
