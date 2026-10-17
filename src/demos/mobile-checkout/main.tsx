import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  type Contact,
  type Errors,
  initialCheckout,
  money,
  products,
  totals,
  transition,
  validate,
  validPromo,
} from './model';
import './styles.css';

const emptyContact: Contact = {
  name: '',
  email: '',
  address: '',
  city: '',
  postal: '',
  instructions: '',
};
function App() {
  const [checkout, dispatch] = useReducer(transition, initialCheckout);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<Errors>({});
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const errorSummary = useRef<HTMLDivElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const promoField = useRef<HTMLInputElement>(null);
  const summary = totals(checkout);
  useLayoutEffect(() => {
    if (attempt > 0) errorSummary.current?.focus();
  }, [attempt]);
  useLayoutEffect(() => {
    if (success) successHeading.current?.focus();
  }, [success]);
  function field(key: keyof Contact, label: string, autoComplete: string, required = true) {
    return (
      <label className="field" htmlFor={key}>
        {label}
        {!required && ' (optional)'}
        <input
          id={key}
          name={key}
          type={key === 'email' ? 'email' : 'text'}
          autoComplete={autoComplete}
          required={required}
          value={contact[key]}
          maxLength={key === 'instructions' ? 300 : 120}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          onChange={(event) => setContact({ ...contact, [key]: event.target.value })}
        />
        {errors[key] && (
          <span className="error" id={`${key}-error`}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  return (
    <main>
      <header>
        <a href="/">← Portfolio</a>
        <span className="badge">INTERACTION DEMO</span>
      </header>
      <div className="intro">
        <p className="eyebrow">THE LITTLE GOODS STORE / FICTIONAL</p>
        <h1>
          Good things,
          <br />
          almost yours.
        </h1>
        <p>A small checkout with room for the details.</p>
      </div>
      {success ? (
        <section className="card success">
          <p className="eyebrow">SIMULATION COMPLETE</p>
          <h2 ref={successHeading} tabIndex={-1}>
            Your demo order is placed.
          </h2>
          <p>No order was created, no email was sent, and no payment was collected.</p>
          <p>
            {checkout.fulfilment === 'delivery' ? 'Demo delivery' : 'Demo pickup'} · simulated total{' '}
            <strong>{money(summary.total)}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setContact(emptyContact);
              setErrors({});
              setAttempt(0);
            }}
          >
            Try checkout again
          </button>
        </section>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const nextErrors = validate(contact, checkout.fulfilment);
            setErrors(nextErrors);
            if (Object.keys(nextErrors).length) setAttempt((value) => value + 1);
            else {
              setContact(emptyContact);
              setSuccess(true);
            }
          }}
        >
          <div className="steps">
            <section className="card">
              <div className="section-title">
                <span>01</span>
                <h2>Your bag</h2>
                <small>2 products</small>
              </div>
              {products.map((product, index) => (
                <div className="product" key={product.name}>
                  <div className={`product-art art-${index}`} aria-hidden="true">
                    {product.mark}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.detail}</p>
                    <strong>{money(product.price)}</strong>
                    <div className="quantity">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        disabled={checkout.quantities[index] === 1}
                        onClick={() =>
                          dispatch({ type: 'quantity', index: index as 0 | 1, delta: -1 })
                        }
                      >
                        −
                      </button>
                      <output aria-label={`${product.name} quantity`}>
                        {checkout.quantities[index]}
                      </output>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        disabled={checkout.quantities[index] === 9}
                        onClick={() =>
                          dispatch({ type: 'quantity', index: index as 0 | 1, delta: 1 })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong className="line-total">
                    {money(product.price * checkout.quantities[index])}
                  </strong>
                </div>
              ))}
              <p className="hint">Quantities: 1–9 per item. All products and prices are made up.</p>
            </section>
            <section className="card">
              <div className="section-title">
                <span>02</span>
                <h2>Make it your way</h2>
              </div>
              <fieldset className="fulfilment">
                <legend>How would you like to receive it?</legend>
                {(['delivery', 'pickup'] as const).map((value) => (
                  <label key={value} className={checkout.fulfilment === value ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="fulfilment"
                      value={value}
                      checked={checkout.fulfilment === value}
                      onChange={() => {
                        dispatch({ type: 'fulfilment', value });
                        setErrors({});
                      }}
                    />
                    <span>
                      <strong>{value === 'delivery' ? 'Delivery' : 'Pickup'}</strong>
                      <small>
                        {value === 'delivery' ? '€4.90 flat fee' : 'Free · demo counter'}
                      </small>
                    </span>
                  </label>
                ))}
              </fieldset>
              <p className="hint">
                Use fictional details, for example Demo Guest and demo@example.com. Nothing is saved
                or sent.
              </p>
              {Object.keys(errors).length > 0 && (
                <div className="error-summary" ref={errorSummary} tabIndex={-1} role="alert">
                  <strong>Check your details</strong>
                  <ul>
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key}>
                        <a href={`#${key}`}>{message}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {field('name', 'Contact name', 'off')}
              {field('email', 'Email', 'off')}
              {checkout.fulfilment === 'delivery' ? (
                <div className="address">
                  {field('address', 'Street address', 'off')}
                  <div className="field-row">
                    {field('city', 'City', 'off')}
                    {field('postal', 'Postal code', 'off')}
                  </div>
                  {field('instructions', 'Delivery instructions', 'off', false)}
                </div>
              ) : (
                <p className="pickup-note">
                  Pickup at the fictional Little Goods demo counter. No real location or
                  reservation.
                </p>
              )}
            </section>
          </div>
          <aside className="card order">
            <p className="eyebrow">THE FINAL DETAILS</p>
            <h2>Order summary</h2>
            <label className="field" htmlFor="promo">
              Promo code
              <input
                id="promo"
                ref={promoField}
                value={promoInput}
                disabled={checkout.promo}
                onChange={(event) => setPromoInput(event.target.value)}
                aria-describedby="promo-help promo-feedback"
              />
            </label>
            <p id="promo-help" className="hint">
              Try DEMO10 for 10% off products, rounded to the nearest cent. Delivery is excluded.
            </p>
            <button
              className="secondary"
              type="button"
              onClick={() => {
                if (checkout.promo) {
                  dispatch({ type: 'promo', value: false });
                  setPromoInput('');
                  setPromoMessage('Promo removed.');
                  promoField.current?.focus();
                } else if (validPromo(promoInput)) {
                  dispatch({ type: 'promo', value: true });
                  setPromoMessage('DEMO10 applied: 10% off products.');
                } else setPromoMessage('Code not recognised. Try DEMO10.');
              }}
            >
              {checkout.promo ? 'Remove promo' : 'Apply promo'}
            </button>
            <p id="promo-feedback" className="feedback" role="status">
              {promoMessage}
            </p>
            <div aria-live="polite" aria-atomic="true">
              <dl>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{money(summary.subtotal)}</dd>
                </div>
                {checkout.promo && (
                  <div>
                    <dt>DEMO10 · 10% off</dt>
                    <dd>−{money(summary.discount)}</dd>
                  </div>
                )}
                <div>
                  <dt>{checkout.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}</dt>
                  <dd>{summary.delivery ? money(summary.delivery) : 'Free'}</dd>
                </div>
                <div className="total">
                  <dt>
                    Total <small>EUR</small>
                  </dt>
                  <dd>{money(summary.total)}</dd>
                </div>
              </dl>
            </div>
            <p className="demo-notice">Demo only — no payment will be collected.</p>
            <button className="place-order" type="submit">
              Place demo order <span aria-hidden="true">↗</span>
            </button>
            <p className="hint">
              Local simulation. No taxes or other charges are added. No real order, payment, or
              email.
            </p>
          </aside>
        </form>
      )}
      <footer>Made for the interaction. Entirely fictional.</footer>
    </main>
  );
}
const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');
createRoot(root).render(<App />);
