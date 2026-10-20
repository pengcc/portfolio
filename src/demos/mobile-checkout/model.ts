export type Fulfilment = 'delivery' | 'pickup';
export const products = [
  { name: 'Everyday tote', detail: 'Natural canvas · synthetic item', price: 2400, mark: '01' },
  { name: 'Pocket notebook', detail: 'Sage green · synthetic item', price: 850, mark: '02' },
] as const;
export const PROMO_CODE = 'DEMO10';
export interface Contact {
  name: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  instructions: string;
}
export type Errors = Partial<Record<keyof Contact, string>>;
export interface Checkout {
  quantities: [number, number];
  fulfilment: Fulfilment;
  promo: boolean;
}
export const initialCheckout: Checkout = {
  quantities: [1, 1],
  fulfilment: 'delivery',
  promo: false,
};
export type Action =
  | { type: 'quantity'; index: 0 | 1; delta: -1 | 1 }
  | { type: 'fulfilment'; value: Fulfilment }
  | { type: 'promo'; value: boolean };
export function transition(state: Checkout, action: Action): Checkout {
  if (action.type === 'fulfilment') return { ...state, fulfilment: action.value };
  if (action.type === 'promo') return { ...state, promo: action.value };
  const quantities: [number, number] = [...state.quantities];
  quantities[action.index] = Math.max(1, Math.min(9, quantities[action.index] + action.delta));
  return { ...state, quantities };
}
export function totals(state: Checkout) {
  const subtotal = products.reduce(
    (sum, product, index) => sum + product.price * state.quantities[index],
    0,
  );
  const discount = state.promo ? Math.round(subtotal / 10) : 0;
  const delivery = state.fulfilment === 'delivery' ? 490 : 0;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
export function validPromo(code: string) {
  return code.trim().toUpperCase() === PROMO_CODE;
}
export function validate(contact: Contact, fulfilment: Fulfilment): Errors {
  const errors: Errors = {};
  if (!contact.name.trim()) errors.name = 'Enter a contact name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
    errors.email = 'Enter an email such as demo@example.com.';
  if (fulfilment === 'delivery') {
    if (!contact.address.trim()) errors.address = 'Enter a demo street address.';
    if (!contact.city.trim()) errors.city = 'Enter a city.';
    if (!contact.postal.trim()) errors.postal = 'Enter a postal code.';
  }
  return errors;
}
export const money = (cents: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
