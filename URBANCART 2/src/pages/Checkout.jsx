import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TAX_RATE, calcTotals, useStore } from '../context/StoreContext.jsx';
import { RX, luhn, rupee, useTitle } from '../data/utils.js';
import Field, { useForm } from '../components/Field.jsx';
import Img from '../components/Img.jsx';

const req = m => v => v ? '' : m;

export default function Checkout() {
  useTitle('Checkout');
  const { cart, coupon, currentUser, buyNow, setBuyNow, clearCart, placeOrder, toast } = useStore();
  const [sp] = useSearchParams(), nav = useNavigate();
  const isBuyNow = sp.get('buy') === '1' && !!buyNow;
  const t = calcTotals(isBuyNow ? [buyNow] : cart, coupon), u = currentUser || {};
  const f = useForm({ name: u.name || '', phone: u.phone || '', email: u.email || '', house: '', street: '', city: '', state: '', pin: '', country: 'India', upi: '', cardNo: '', holder: '', expiry: '', cvv: '' });
  const [pay, setPay] = useState('UPI'), [busy, setBusy] = useState(false);

  if (!t.items.length && !busy) return <div className="wrap sec"><div className="empty"><h1>Nothing to check out</h1><p className="mu">Your cart is empty. Add a product first.</p><Link className="btn" to="/shop">Continue Shopping</Link></div></div>;

  const submit = e => {
    e.preventDefault();
    const rules = [['name', v => v.length < 2 ? 'Enter your full name' : ''], ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number'], ['email', v => RX.email.test(v) ? '' : 'Enter a valid email address'],
      ['house', req('Enter house / flat number')], ['street', req('Enter street or area')], ['city', req('Enter city')], ['state', req('Enter state')], ['pin', v => RX.pin.test(v) ? '' : 'Enter a valid 6-digit PIN code'], ['country', req('Enter country')]];
    if (pay === 'UPI') rules.push(['upi', v => RX.upi.test(v) ? '' : 'Enter a valid UPI ID, like demo@upi']);
    if (pay === 'Credit/Debit Card') rules.push(
      ['cardNo', v => { const n = v.replace(/\s/g, ''); return /^\d{16}$/.test(n) && luhn(n) ? '' : 'Enter a valid 16-digit card number'; }],
      ['holder', v => v.length < 2 ? 'Enter the name on the card' : ''],
      ['expiry', v => { const x = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v); if (!x) return 'Use MM/YY format'; return new Date(2000 + +x[2], +x[1], 1) > new Date() ? '' : 'This card has expired'; }],
      ['cvv', v => /^\d{3}$/.test(v) ? '' : 'Enter the 3-digit CVV']);
    if (!f.run(rules)) { toast('Please fix the highlighted fields'); return; }
    const bad = t.items.find(x => x.product.stock <= 0 || x.qty > x.product.stock);
    if (bad) { toast(bad.product.name + ' is no longer available in this quantity'); return; }
    setBusy(true);
    setTimeout(() => {
      const v = Object.fromEntries(Object.entries(f.v).map(([k, x]) => [k, String(x).trim()]));
      const order = {
        id: 'UC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(), date: new Date().toISOString(), userEmail: currentUser ? currentUser.email : 'guest',
        customer: { name: v.name, phone: v.phone, email: v.email }, address: { house: v.house, street: v.street, city: v.city, state: v.state, pin: v.pin, country: v.country },
        items: t.items.map(x => ({ id: x.id, name: x.product.name, image: x.product.images[0], price: x.product.salePrice, qty: x.qty, color: x.color, size: x.size })),
        totals: { subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, tax: t.tax, total: t.total, coupon },
        payment: { method: pay, status: pay === 'Cash on Delivery' ? 'Pay on delivery' : 'Paid (simulated)' }, status: 'Order Placed', estimatedDelivery: new Date(Date.now() + 5 * 864e5).toISOString()
      };
      placeOrder(order);
      if (isBuyNow) setBuyNow(null); else clearCart();
      nav('/order-success/' + order.id);
    }, 900);
  };
  const cardFmt = e => f.setV(s => ({ ...s, cardNo: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }));
  const expFmt = e => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); f.setV(s => ({ ...s, expiry: d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d })); };

  return (
    <div className="wrap">
      <h1 style={{ paddingTop: 28 }}>Checkout</h1>
      <div className="cartg" style={{ paddingTop: 12 }}>
        <form id="coForm" onSubmit={submit} noValidate>
          <section className="fs"><h2>Customer information</h2>
            <Field label="Full name" autoComplete="name" {...f.bind('name')} />
            <div className="two">
              <Field label="Mobile number" type="tel" maxLength="10" inputMode="numeric" {...f.bind('phone')} />
              <Field label="Email" type="email" autoComplete="email" {...f.bind('email')} />
            </div>
          </section>
          <section className="fs"><h2>Delivery address</h2>
            <div className="two">
              <Field label="House / Flat" {...f.bind('house')} /><Field label="Street / Area" {...f.bind('street')} />
              <Field label="City" {...f.bind('city')} /><Field label="State" {...f.bind('state')} />
              <Field label="PIN code" maxLength="6" inputMode="numeric" {...f.bind('pin')} /><Field label="Country" {...f.bind('country')} />
            </div>
          </section>
          <section className="fs"><h2>Payment (simulated)</h2>
            <div className="note">Demo only. No real payment is taken. Test data: UPI <b>demo@upi</b>, card <b>4111 1111 1111 1111</b>, any future expiry, any 3-digit CVV.</div>
            <div className="pays">{['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map(m => <label key={m}><input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} />{m === 'Credit/Debit Card' ? 'Card' : m}</label>)}</div>
            {pay === 'UPI' && <Field label="UPI ID" placeholder="demo@upi" autoComplete="off" {...f.bind('upi')} />}
            {pay === 'Credit/Debit Card' && <>
              <Field label="Card number" inputMode="numeric" placeholder="4111 1111 1111 1111" autoComplete="off" {...f.bind('cardNo')} onChange={cardFmt} />
              <Field label="Cardholder name" autoComplete="off" {...f.bind('holder')} />
              <div className="two">
                <Field label="Expiry (MM/YY)" placeholder="12/30" maxLength="5" autoComplete="off" {...f.bind('expiry')} onChange={expFmt} />
                <Field label="CVV" type="password" maxLength="3" inputMode="numeric" autoComplete="off" {...f.bind('cvv')} />
              </div></>}
            {pay === 'Cash on Delivery' && <p className="mu">Pay in cash when your order arrives.</p>}
          </section>
        </form>
        <aside className="sum">
          <h2 style={{ fontSize: 18 }}>Order summary</h2>
          {t.items.map((x, i) => <div className="mini" key={i}><Img src={x.product.images[0]} alt={x.product.name} /><span>{x.product.name}<br /><small className="mu">Qty {x.qty}{x.color ? ' / ' + x.color : ''}{x.size ? ' / ' + x.size : ''}</small></span><b>{rupee(x.product.salePrice * x.qty)}</b></div>)}
          <div className="l"><span>Subtotal</span><span>{rupee(t.subtotal)}</span></div>
          <div className={'l' + (t.discount ? ' okc' : '')}><span>Discount</span><span>{t.discount ? '− ' + rupee(t.discount) : '₹0'}</span></div>
          <div className="l"><span>Shipping</span><span>{t.shipping ? rupee(t.shipping) : 'Free'}</span></div>
          <div className="l"><span>Tax ({TAX_RATE * 100}%)</span><span>{rupee(t.tax)}</span></div>
          <div className="l tot"><span>Total</span><span>{rupee(t.total)}</span></div>
          <button className="btn" type="submit" form="coForm" disabled={busy}>{busy ? 'Processing payment…' : 'Place Order'}</button>
        </aside>
      </div>
    </div>
  );
}
