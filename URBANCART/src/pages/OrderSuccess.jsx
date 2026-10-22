import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { fmtDate, rupee, useTitle } from '../data/utils.js';
import Img from '../components/Img.jsx';

export default function OrderSuccess() {
  const { id } = useParams(), { orders } = useStore(), o = orders.find(x => x.id === id);
  useTitle(o ? 'Order ' + o.id : 'Order not found');
  if (!o) return <div className="wrap"><div className="okbox"><div className="empty" style={{ border: 0 }}><h1>Order not found</h1><p className="mu">We could not find this order in this browser.</p><Link className="btn" to="/shop">Continue Shopping</Link></div></div></div>;
  const a = o.address;
  return (
    <div className="wrap"><div className="okbox">
      <div className="tick" aria-hidden="true">✓</div>
      <h1>Order Placed Successfully!</h1>
      <p className="mu">Thank you, {o.customer.name}. This is a demo order, so no email is sent and no money is charged.</p>
      <dl className="kv">
        <dt>Order ID</dt><dd><b>{o.id}</b></dd>
        <dt>Estimated delivery</dt><dd>{fmtDate(o.estimatedDelivery)}</dd>
        <dt>Delivery address</dt><dd>{a.house}, {a.street}, {a.city}, {a.state} {a.pin}, {a.country}</dd>
        <dt>Payment</dt><dd>{o.payment.method} ({o.payment.status})</dd>
      </dl>
      <h2 style={{ fontSize: 18 }}>Items</h2>
      {o.items.map((i, k) => <div className="mini" key={k}><Img src={i.image} alt={i.name} /><span>{i.name}<br /><small className="mu">Qty {i.qty}</small></span><b>{rupee(i.price * i.qty)}</b></div>)}
      <div className="sum" style={{ border: 0, padding: '12px 0 0', position: 'static' }}>
        <div className="l"><span>Subtotal</span><span>{rupee(o.totals.subtotal)}</span></div>
        {o.totals.discount > 0 && <div className="l okc"><span>Discount</span><span>− {rupee(o.totals.discount)}</span></div>}
        <div className="l"><span>Shipping</span><span>{o.totals.shipping ? rupee(o.totals.shipping) : 'Free'}</span></div>
        <div className="l"><span>Tax</span><span>{rupee(o.totals.tax)}</span></div>
        <div className="l tot"><span>Total</span><span>{rupee(o.totals.total)}</span></div>
      </div>
      <div className="row"><Link className="btn" to="/shop">Continue Shopping</Link><Link className="btn ghost" to="/orders">View Orders</Link></div>
    </div></div>
  );
}
