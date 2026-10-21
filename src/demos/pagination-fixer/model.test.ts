import { describe, expect, it } from 'vitest';
import {
  beginRefresh,
  duplicateCount,
  initialState,
  isCatalogOrder,
  listsMatch,
  nextPageToLoad,
  type PageNumber,
  type PageResponse,
  pageProducts,
  products,
  receivePage,
  stableProducts,
} from './model';

function result(page: PageNumber, generation = 0): PageResponse {
  return { page, generation, products: pageProducts(page) };
}

describe('pagination and duplicate-data comparison', () => {
  it('uses synthetic overlapping pages as a real duplicate fixture', () => {
    expect(pageProducts(1).at(-1)?.id).toBe(pageProducts(2)[0].id);
    expect(pageProducts(2).at(-1)?.id).toBe(pageProducts(3)[0].id);
  });

  it('keeps all 12 products exactly once after three overlapping pages', () => {
    const state = receivePage(receivePage(initialState(), result(2)), result(3));
    expect(state.naive).toHaveLength(14);
    expect(duplicateCount(state.naive)).toBe(2);
    expect(stableProducts(state).map((product) => product.id)).toEqual(
      products.map((product) => product.id),
    );
    expect(duplicateCount(stableProducts(state))).toBe(0);
  });

  it('waits for missing intermediate pages and recovers correct ordering after out-of-order responses', () => {
    const early = receivePage(initialState(), result(3));
    expect(stableProducts(early)).toHaveLength(5);
    expect(early.naive).toHaveLength(9);

    const complete = receivePage(early, result(2));
    expect(stableProducts(complete)).toHaveLength(12);
    expect(isCatalogOrder(stableProducts(complete))).toBe(true);
    expect(isCatalogOrder(complete.naive)).toBe(false);
  });

  it('ignores a stale pagination response after refresh without losing the refreshed list', () => {
    const refreshing = beginRefresh(initialState());
    expect(stableProducts(refreshing)).toHaveLength(5);
    const latest = receivePage(refreshing, result(1, 1));
    const late = receivePage(latest, result(2, 0));
    expect(stableProducts(late).map((product) => product.id)).toEqual(
      pageProducts(1).map((product) => product.id),
    );
    expect(late.staleIgnored).toBe(1);
    expect(duplicateCount(late.naive)).toBeGreaterThan(0);
  });

  it('uses only the latest of two rapid refresh generations', () => {
    const twice = beginRefresh(beginRefresh(initialState()));
    const newest = receivePage(twice, result(1, 2));
    const outdated = receivePage(newest, result(1, 1));
    expect(outdated.generation).toBe(2);
    expect(outdated.staleIgnored).toBe(1);
    expect(stableProducts(outdated)).toHaveLength(5);
    expect(duplicateCount(stableProducts(outdated))).toBe(0);
    expect(outdated.naive).toHaveLength(15);
  });

  it('makes repeated page delivery idempotent in the fixed list', () => {
    const once = receivePage(initialState(), result(2));
    const twice = receivePage(once, result(2));
    expect(stableProducts(twice)).toEqual(stableProducts(once));
    expect(twice.naive.length).toBeGreaterThan(once.naive.length);
  });

  it('replaces prior pagination on refresh rather than leaving stale pages attached', () => {
    const full = receivePage(initialState(), result(2));
    const refreshed = receivePage(beginRefresh(full), result(1, 1));
    expect(stableProducts(refreshed)).toHaveLength(5);
    expect(refreshed.pages[2]).toBeUndefined();
    expect(isCatalogOrder(stableProducts(refreshed))).toBe(true);
  });
});

describe('pagination controls and visible comparison', () => {
  it('finishes manual pagination after either full-page preset, including buffered pages', () => {
    for (const order of [
      [2, 3],
      [3, 2],
    ] as const) {
      let state = initialState();
      expect(nextPageToLoad(state)).toBe(2);
      state = receivePage(state, result(order[0]));
      expect(nextPageToLoad(state)).toBe(order[0] === 2 ? 3 : 2);
      state = receivePage(state, result(order[1]));
      expect(nextPageToLoad(state)).toBe(4);
    }
  });

  it('restores pagination after refresh, ignores old pages, and resets to page 2', () => {
    const full = receivePage(receivePage(initialState(), result(2)), result(3));
    const refreshing = beginRefresh(full);
    expect(nextPageToLoad(refreshing)).toBe(1);
    const latest = receivePage(refreshing, result(1, 1));
    const late = receivePage(latest, result(2));
    expect(nextPageToLoad(late)).toBe(2);
    const second = receivePage(late, result(2, 1));
    expect(nextPageToLoad(second)).toBe(3);
    expect(nextPageToLoad(receivePage(second, result(3, 1)))).toBe(4);
    expect(nextPageToLoad(initialState())).toBe(2);
  });

  it('distinguishes matching lists from buffered and completed divergent lists', () => {
    const start = initialState();
    expect(listsMatch(start.naive, stableProducts(start))).toBe(true);
    const early = receivePage(start, result(3));
    expect(early.naive).toHaveLength(9);
    expect(stableProducts(early)).toHaveLength(5);
    expect(listsMatch(early.naive, stableProducts(early))).toBe(false);
    const complete = receivePage(early, result(2));
    expect(listsMatch(complete.naive, stableProducts(complete))).toBe(false);
    const fixed = stableProducts(complete);
    expect(listsMatch(fixed, [...fixed])).toBe(true);
    expect(listsMatch(fixed, [...fixed].reverse())).toBe(false);
    expect(
      listsMatch(
        fixed,
        fixed.map((item, index) => (index === 0 ? { ...item, price: 1 } : item)),
      ),
    ).toBe(false);
  });
});
