import { describe, expect, it } from 'vitest';
import { demoCatalog } from './catalog';

describe('demo catalog', () => {
  it('keeps each route slug unique and valid', () => {
    const slugs = demoCatalog.map((demo) => demo.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('does not advertise unimplemented demos as navigable', () => {
    for (const demo of demoCatalog) {
      expect(demo.title.trim()).not.toBe('');
      if (demo.status === 'planned') {
        expect('href' in demo).toBe(false);
      } else {
        expect(demo.href).toMatch(/^\//);
      }
    }
  });
});
