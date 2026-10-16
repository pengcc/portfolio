import { describe, expect, it } from 'vitest';
import { demoCatalog, isSafeDemoHref } from './catalog';

describe('demo catalog', () => {
  it('keeps each route slug unique and valid', () => {
    const slugs = demoCatalog.map((demo) => demo.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('keeps planned entries unlinked and checks every live entry against the safe link policy', () => {
    for (const demo of demoCatalog) {
      expect(demo.title.trim()).not.toBe('');
      if (demo.status === 'planned') {
        expect('href' in demo).toBe(false);
      } else {
        expect(isSafeDemoHref(demo.href)).toBe(true);
      }
    }
  });

  it('accepts an independently hosted live demo', () => {
    const externalLiveDemo = {
      status: 'live' as const,
      href: 'https://demos.example.com/json-csv',
    };
    expect(isSafeDemoHref(externalLiveDemo.href)).toBe(true);
  });

  it.each([
    '/demos/json-csv',
    '/',
    'https://demos.example.com/json-csv',
    'http://localhost:4173/',
  ])('accepts safe demo href %s', (href) => {
    expect(isSafeDemoHref(href)).toBe(true);
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,hello',
    'mailto:test@example.com',
    '//another-site.example.com/path',
    '/\\another-site.example.com',
    'https://',
    'https://example.com/has space',
    '',
  ])('rejects unsafe or invalid demo href %s', (href) => {
    expect(isSafeDemoHref(href)).toBe(false);
  });
});
