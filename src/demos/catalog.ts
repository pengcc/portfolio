interface BaseDemo {
  slug: string;
  title: string;
  description: string;
}

type Demo = BaseDemo &
  ({ status: 'planned' } | { status: 'live'; href: string; sourceHref: string });

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

// Display information for live demos and future candidates.
export const demoCatalog: readonly Demo[] = [
  {
    slug: 'json-csv',
    title: 'JSON → CSV Converter',
    description:
      'Convert flat JSON into CSV, preview the results, then copy or download your file.',
    status: 'live',
    href: '/demos/json-csv/',
    sourceHref: 'https://github.com/pengcc/portfolio/tree/main/src/demos/json-csv',
  },
  {
    slug: 'shopify-csv',
    title: 'Shopify CSV Validator',
    description:
      'Check product CSV files for focused issues before import. This is not a complete Shopify compatibility check.',
    status: 'live',
    href: '/demos/shopify-csv/',
    sourceHref: 'https://github.com/pengcc/portfolio/tree/main/src/demos/shopify-csv',
  },
  {
    slug: 'mobile-checkout',
    title: 'Mobile Checkout',
    description: 'A focused, mobile-first checkout interaction example.',
    status: 'live',
    href: '/demos/mobile-checkout/',
    sourceHref: 'https://github.com/pengcc/portfolio/tree/main/src/demos/mobile-checkout',
  },
];
