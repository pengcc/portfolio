import { describe, expect, it } from 'vitest';
import {
  beginRefresh,
  duplicateCount,
  initialState,
  isCatalogOrder,
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
