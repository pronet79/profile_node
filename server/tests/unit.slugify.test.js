import { describe, it, expect } from 'vitest';
import { slugify } from '../src/utils/slugify.js';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('strips punctuation', () => {
    expect(slugify('A Fancy: Project!! (v2)')).toBe('a-fancy-project-v2');
  });
  it('collapses repeated separators and trims', () => {
    expect(slugify('  multiple   spaces__and--dashes ')).toBe('multiple-spaces-and-dashes');
  });
  it('handles empty input', () => {
    expect(slugify('')).toBe('');
  });
});
