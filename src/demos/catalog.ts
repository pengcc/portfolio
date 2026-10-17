interface BaseDemo {
  slug: string;
  title: string;
  description: string;
}

type Demo = BaseDemo & ({ status: 'planned' } | { status: 'live'; href: string });

/** Only local paths and direct HTTP(S) URLs can be rendered as demo links. */
export function isSafeDemoHref(href: string): boolean {
  if (!href || /[\s\\]/.test(href)) {
    return false;
  }

  if (href.startsWith('/')) {
    return !href.startsWith('//');
  }

  if (!/^https?:\/\//i.test(href)) {
    return false;
  }

  try {
    const url = new URL(href);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

// Registry only: these are future migration candidates, not running demos.
export const demoCatalog: readonly Demo[] = [
  {
    slug: 'json-csv',
    title: 'JSON → CSV Converter',
    description: 'Convert structured JSON into reusable CSV files.',
    status: 'live',
    href: '/demos/json-csv/',
  },
  {
    slug: 'shopify-csv',
    title: 'Shopify CSV Validator',
    description: 'Inspect common import-file issues before uploading.',
    status: 'live',
    href: '/demos/shopify-csv/',
  },
  {
    slug: 'mobile-checkout',
    title: 'Mobile Checkout',
    description: 'A focused, mobile-first checkout interaction example.',
    status: 'live',
    href: '/demos/mobile-checkout/',
  },
];
