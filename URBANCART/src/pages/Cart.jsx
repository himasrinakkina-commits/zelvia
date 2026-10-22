import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FREE_SHIPPING_ABOVE, TAX_RATE, calcTotals, useStore } from '../context/StoreContext.jsx';
import { rupee, useTitle } from '../data/utils.js';
import Img from '../components/Img.jsx';

export default function Cart() {
  useTitle('Your Cart');
  const { cart, coupon, setQty, removeFromCart, clearCart, applyCoupon, toast } = useStore();
  const t = calcTotals(cart, coupon);
  const [code, setCode] = useState(coupon), [cm, setCm] = useState(null);
  if (!t.items.length) return <div className="wrap sec"><div className="empty"><h1>Your cart is empty</h1><p className="mu">Add something you like and it will show up here.</p><Link className="btn" to="/shop">Continue Shopping</Link></div></div>;
  const apply = e => { e.preventDefault(); const r = applyCoupon(code); setCm(r); toast(r.ok ? '✓ Coupon applied' : r.msg); };
  return (
    <div className="wrap cartg">
      <section>
        <div className="chead"><h1>Your cart ({t.count} item{t.count > 1 ? 's' : ''})</h1><button className="link" onClick={() => { clearCart(); setCm(null); toast('Cart cleared'); }}>Clear cart</button></div>
        {t.items.map((x, i) => (
          <div className="crow" key={i}>
            <Link to={'/product/' + x.id}><Img src={x.product.images[0]} alt={x.product.name} /></Link>
            <div><Link to={'/product/' + x.id}>{x.product.name}</Link><div className="mu" style={{ fontSize: 13 }}>{[x.color, x.size].filter(Boolean).join(' / ')} {rupee(x.product.salePrice)} each</div></div>
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => setQty(i, x.qty - 1)}>−</button><span>{x.qty}</span>
              <button aria-label="Increase quantity" onClick={() => { if (x.qty >= x.product.stock) toast('No more stock available'); setQty(i, x.qty + 1); }}>+</button>
            </div>
            <b>{rupee(x.product.salePrice * x.qty)}</b>
            <button className="link" onClick={() => removeFromCart(i)}>Remove</button>
          </div>
        ))}
      </section>
      <aside className="sum">
        <h2 style={{ fontSize: 18 }}>Order summary</h2>
        <div className="l"><span>Subtotal</span><span>{rupee(t.subtotal)}</span></div>
        {t.discount > 0 && <div className="l okc"><span>Discount ({coupon})</span><span>− {rupee(t.discount)}</span></div>}
        <div className="l"><span>Shipping</span><span>{t.shipping ? rupee(t.shipping) : 'Free'}</span></div>
        <div className="l"><span>Tax ({TAX_RATE * 100}%)</span><span>{rupee(t.tax)}</span></div>
        <div className="l tot"><span>Total</span><span>{rupee(t.total)}</span></div>
        {t.shipping > 0 && <p className="mu" style={{ fontSize: 13 }}>Add {rupee(FREE_SHIPPING_ABOVE + 1 - t.subtotal)} more for free shipping.</p>}
        <form className="cform" onSubmit={apply}>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
          <button className="btn ghost" type="submit">Apply</button>
        </form>
        <div className={'msg ' + (cm && cm.ok ? 'okc' : 'erc')} role="status">{cm ? cm.msg : 'Try URBAN10 or WELCOME200'}</div>
        <Link className="btn" to="/checkout">Proceed to Checkout</Link>
        <Link className="btn ghost" to="/shop">Continue Shopping</Link>
      </aside>
    </div>
  );
}
