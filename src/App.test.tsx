import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { demoCatalog } from './demos/catalog';

describe('homepage', () => {
  it('renders only live catalog entries with demo and source actions', () => {
    const html = renderToStaticMarkup(<App />);
    const live = demoCatalog.filter((demo) => demo.status === 'live');
    expect(live).toHaveLength(2);
    expect(html.match(/<li /g)).toHaveLength(live.length);
    for (const demo of live) {
      expect(html).toContain(demo.title);
      expect(html).toContain(`href="${demo.href}"`);
      expect(html).toContain(`href="${demo.sourceHref}"`);
    }
    expect(html).not.toContain('Mobile Checkout');
    expect(html).not.toContain('bootstrap');
  });

  it('preserves safe link handling for catalog-driven actions', async () => {
    vi.resetModules();
    vi.doMock('./demos/catalog', async (importOriginal) => {
      const original = await importOriginal<typeof import('./demos/catalog')>();
      return {
        ...original,
        demoCatalog: [
          {
            slug: 'unsafe',
            title: 'Unsafe demo',
            description: 'Test fixture',
            status: 'live',
            href: 'javascript:alert(1)',
            sourceHref: 'javascript:alert(2)',
          },
        ],
      };
    });
    try {
      const { App: UnsafeApp } = await import('./App');
      const html = renderToStaticMarkup(<UnsafeApp />);
      expect(html).toContain('Unavailable');
      expect(html).not.toContain('javascript:');
    } finally {
      vi.doUnmock('./demos/catalog');
      vi.resetModules();
    }
  });
});
