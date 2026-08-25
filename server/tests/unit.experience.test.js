import { describe, it, expect } from 'vitest';
import { experienceSchema, projectSchema } from '../src/validators/schemas.js';

const base = { company: 'Acme', position: 'Engineer', startDate: '2020-01-01' };

describe('experienceSchema date handling', () => {
  it('accepts a current role with a blank end date', () => {
    const r = experienceSchema.safeParse({ ...base, current: true, endDate: '' });
    expect(r.success).toBe(true);
  });
  it('accepts a past role with a blank end date', () => {
    expect(experienceSchema.safeParse({ ...base, current: false, endDate: '' }).success).toBe(true);
  });
  it('accepts an explicit end date', () => {
    expect(experienceSchema.safeParse({ ...base, endDate: '2022-06-01' }).success).toBe(true);
  });
  it('requires a start date with a clear message', () => {
    const r = experienceSchema.safeParse({ company: 'A', position: 'B', startDate: '' });
    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toMatch(/Start date is required/);
  });
  it('clears the end date when the role is current', () => {
    const r = experienceSchema.safeParse({ ...base, current: true, endDate: '2022-06-01' });
    expect(r.success).toBe(true);
    expect(r.data.endDate).toBeUndefined();
  });
});

describe('projectSchema keeps media fields', () => {
  it('retains coverImage and videoUrl', () => {
    const r = projectSchema.safeParse({ title: 'X', coverImage: 'https://cdn/x.png', videoUrl: 'https://youtu.be/abc' });
    expect(r.success).toBe(true);
    expect(r.data.videoUrl).toBe('https://youtu.be/abc');
  });
});
