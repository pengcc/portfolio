interface BaseDemo {
  slug: string;
  title: string;
  description: string;
}

type Demo = BaseDemo & ({ status: 'planned' } | { status: 'live'; href: string });

// Registry only: these are future migration candidates, not running demos.
export const demoCatalog: readonly Demo[] = [
  {
    slug: 'json-csv',
    title: 'JSON → CSV Converter',
    description: 'Convert structured JSON into reusable CSV files.',
    status: 'planned',
  },
  {
    slug: 'shopify-csv',
    title: 'Shopify CSV Validator',
    description: 'Inspect common import-file issues before uploading.',
    status: 'planned',
  },
  {
    slug: 'mobile-checkout',
    title: 'Mobile Checkout',
    description: 'A focused, mobile-first checkout interaction example.',
    status: 'planned',
  },
];
