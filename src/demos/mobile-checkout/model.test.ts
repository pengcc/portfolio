import { describe, expect, it } from 'vitest';
import {
  type Contact,
  initialCheckout,
  money,
  totals,
  transition,
  validate,
  validPromo,
} from './model';

const contact: Contact = {
  name: 'Demo Guest',
  email: 'demo@example.com',
  address: '1 Example Street',
  city: 'Example City',
  postal: '12345',
  instructions: '',
};
describe('checkout interactions', () => {
  it('recalculates delivery, pickup, promo and quantities without mutating the original cart', () => {
    expect(totals(initialCheckout)).toEqual({
      subtotal: 3250,
      discount: 0,
      delivery: 490,
      total: 3740,
    });
    let state = transition(initialCheckout, { type: 'promo', value: true });
    expect(totals(state).total).toBe(3415);
    state = transition(state, { type: 'fulfilment', value: 'pickup' });
    expect(totals(state)).toEqual({ subtotal: 3250, discount: 325, delivery: 0, total: 2925 });
    state = transition(state, { type: 'quantity', index: 1, delta: 1 });
    expect(totals(state).total).toBe(3690);
    state = transition(state, { type: 'promo', value: false });
    expect(totals(state).total).toBe(4100);
    state = transition(state, { type: 'fulfilment', value: 'delivery' });
    expect(totals(state).total).toBe(4590);
    expect(initialCheckout.quantities).toEqual([1, 1]);
  });
  it('keeps each fixed item between one and nine units', () => {
    let state = transition(initialCheckout, { type: 'quantity', index: 0, delta: -1 });
    expect(state.quantities).toEqual([1, 1]);
    for (let i = 0; i < 12; i++)
      state = transition(state, { type: 'quantity', index: 0, delta: 1 });
    expect(state.quantities).toEqual([9, 1]);
    state = transition(state, { type: 'quantity', index: 0, delta: -1 });
    expect(state.quantities).toEqual([8, 1]);
  });
  it('accepts only the documented code with optional casing and whitespace', () => {
    expect(validPromo(' demo10 ')).toBe(true);
    for (const code of ['', 'DEMO', 'DEMO100', 'FREE']) expect(validPromo(code)).toBe(false);
  });
  it('uses integer cents for every cart combination', () => {
    for (let a = 1; a <= 9; a++)
      for (let b = 1; b <= 9; b++) {
        const result = totals({ quantities: [a, b], fulfilment: 'delivery', promo: true });
        expect(Number.isInteger(result.total)).toBe(true);
        expect(result.total).toBe(2400 * a + 850 * b - Math.round((2400 * a + 850 * b) / 10) + 490);
      }
    expect(money(3415)).toBe('€34.15');
  });
});
describe('demo checkout validation', () => {
  it('accepts valid delivery and optional instructions', () => {
    expect(validate(contact, 'delivery')).toEqual({});
  });
  it('reports all required contact and delivery fields', () => {
    const blank = {
      name: ' ',
      email: 'bad@',
      address: ' ',
      city: '',
      postal: '',
      instructions: '',
    };
    expect(Object.keys(validate(blank, 'delivery'))).toEqual([
      'name',
      'email',
      'address',
      'city',
      'postal',
    ]);
  });
  it('requires no address for pickup, then checks it when switching back', () => {
    const pickup = { ...contact, address: '', city: '', postal: '' };
    expect(validate(pickup, 'pickup')).toEqual({});
    expect(Object.keys(validate(pickup, 'delivery'))).toEqual(['address', 'city', 'postal']);
    expect(validate({ ...pickup, email: '' }, 'pickup').email).toBeDefined();
  });
});
