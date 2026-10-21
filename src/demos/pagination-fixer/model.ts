export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mark: string;
}

export type PageNumber = 1 | 2 | 3;

export interface PageResponse {
  page: PageNumber;
  generation: number;
  products: Product[];
}

export interface ListState {
  generation: number;
  replacing: boolean;
  naive: Product[];
  pages: Partial<Record<PageNumber, Product[]>>;
  staleIgnored: number;
}

// Entirely synthetic fixtures. Pages intentionally overlap at SKU-05 and SKU-09.
export const products: readonly Product[] = [
  { id: 'SKU-01', name: 'Canvas Weekender', category: 'Bags', price: 68, mark: '◒' },
  { id: 'SKU-02', name: 'Studio Desk Lamp', category: 'Home', price: 42, mark: '✳' },
  { id: 'SKU-03', name: 'Everyday Bottle', category: 'Objects', price: 24, mark: '◉' },
  { id: 'SKU-04', name: 'Field Notes Set', category: 'Paper', price: 16, mark: '▤' },
  { id: 'SKU-05', name: 'Ridge Coffee Cup', category: 'Home', price: 22, mark: '◕' },
  { id: 'SKU-06', name: 'Linen Market Tote', category: 'Bags', price: 29, mark: '▱' },
  { id: 'SKU-07', name: 'Softcover Journal', category: 'Paper', price: 19, mark: '▥' },
  { id: 'SKU-08', name: 'Mini Plant Pot', category: 'Home', price: 17, mark: '❋' },
  { id: 'SKU-09', name: 'Travel Organizer', category: 'Bags', price: 34, mark: '◇' },
  { id: 'SKU-10', name: 'Cotton Tea Towel', category: 'Home', price: 14, mark: '≋' },
  { id: 'SKU-11', name: 'Pencil Collection', category: 'Paper', price: 12, mark: '✎' },
  { id: 'SKU-12', name: 'Pocket Umbrella', category: 'Objects', price: 36, mark: '☂' },
];

export function pageProducts(page: PageNumber): Product[] {
  if (page === 1) return products.slice(0, 5);
  if (page === 2) return products.slice(4, 9);
  return products.slice(8, 12);
}

export function initialState(): ListState {
  const firstPage = pageProducts(1);
  return {
    generation: 0,
    replacing: false,
    naive: firstPage,
    pages: { 1: firstPage },
    staleIgnored: 0,
  };
}

// A local asynchronous API, not a network call.
export function requestPage(
  page: PageNumber,
  generation: number,
  delayMs: number,
): Promise<PageResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ page, generation, products: pageProducts(page) }), delayMs);
  });
}

// Keep the old visible list until the first response for the new refresh arrives.
export function beginRefresh(state: ListState): ListState {
  return { ...state, generation: state.generation + 1, replacing: true };
}

// Deliberately incorrect: blindly append every response, even old generations.
export function receivePage(state: ListState, response: PageResponse): ListState {
  const naive = [...state.naive, ...response.products];
  if (response.generation !== state.generation) {
    return { ...state, naive, staleIgnored: state.staleIgnored + 1 };
  }
  const pages = state.replacing ? {} : state.pages;
  return {
    ...state,
    naive,
    replacing: false,
    pages: { ...pages, [response.page]: response.products },
  };
}

// Render only contiguous pages from page 1. Late page 2 can fill a gap after page 3.
export function stableProducts(state: ListState): Product[] {
  const result: Product[] = [];
  const seen = new Set<string>();
  for (const page of [1, 2, 3] as const) {
    const items = state.pages[page];
    if (!items) break;
    for (const product of items) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        result.push(product);
      }
    }
  }
  return result;
}

export function duplicateCount(items: readonly Product[]): number {
  return items.length - new Set(items.map((product) => product.id)).size;
}

export function isCatalogOrder(items: readonly Product[]): boolean {
  const positions = new Map(products.map((product, index) => [product.id, index] as const));
  return items.every(
    (product, index) =>
      index === 0 || (positions.get(items[index - 1].id) ?? -1) < (positions.get(product.id) ?? -1),
  );
}

// Pagination controls consume the same accepted pages as the fixed list.
export function nextPageToLoad(state: ListState): PageNumber | 4 {
  if (state.replacing) return 1;
  for (const page of [1, 2, 3] as const) {
    if (!state.pages[page]) return page;
  }
  return 4;
}

export function listsMatch(left: readonly Product[], right: readonly Product[]): boolean {
  return (
    left.length === right.length &&
    left.every((product, index) => {
      const other = right[index];
      return (
        product.id === other.id &&
        product.name === other.name &&
        product.category === other.category &&
        product.price === other.price &&
        product.mark === other.mark
      );
    })
  );
}
