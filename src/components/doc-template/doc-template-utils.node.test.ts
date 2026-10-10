import { describe, expect, it } from 'vitest';

import { sanitizeUseId, slugify } from './doc-template-utils.ts';
import { extractFencedCode } from './markdown.ts';

describe('slugify', () => {
  it('lowercases and replaces separators with dashes', () => {
    expect(slugify('Basic Usage')).toBe('basic-usage');
    expect(slugify('Button_Group v2')).toBe('button-group-v2');
  });

  it('trims surrounding dashes and collapses repeated separators', () => {
    expect(slugify('  --Hello,   World!--  ')).toBe('hello-world');
    expect(slugify('Button (primary)')).toBe('button-primary');
  });

  it('normalizes the input through NFKD before slugifying', () => {
    expect(slugify('Café Crème')).toBe('cafe-cre-me');
  });

  it('returns an empty string for values without ascii alphanumerics', () => {
    expect(slugify('中文')).toBe('');
    expect(slugify('基础 用法')).toBe('');
  });
});

describe('sanitizeUseId', () => {
  it('removes the characters react puts into generated ids', () => {
    expect(sanitizeUseId('«r0»')).toBe('r0');
    expect(sanitizeUseId(':r1:')).toBe('r1');
    expect(sanitizeUseId('«r2»:')).toBe('r2');
  });

  it('keeps ids that do not contain those characters unchanged', () => {
    expect(sanitizeUseId('r3')).toBe('r3');
  });
});

describe('extractFencedCode', () => {
  it('returns the content of the first fenced code block', () => {
    expect(extractFencedCode('```tsx\n<Button>Hello</Button>\n```')).toBe('<Button>Hello</Button>');
  });

  it('ignores the fence info string and trims the result', () => {
    expect(extractFencedCode('```tsx\n  const a = 1;\n```')).toBe('const a = 1;');
  });

  it('falls back to the trimmed input when no fence is present', () => {
    expect(extractFencedCode('\n plain text \n')).toBe('plain text');
  });
});
