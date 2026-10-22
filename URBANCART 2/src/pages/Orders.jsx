import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { fmtDate, rupee, useTitle } from '../data/utils.js';
import Img from '../components/Img.jsx';

export default function Orders() {
  useTitle('My Orders');
  const { orders, currentUser, advanceOrder, STATUSES } = useStore();
  const mine = orders.filter(o => o.userEmail === (currentUser ? currentUser.email : 'guest'));
  return (
    <div className="wrap sec">
      <h1 className="sh">My orders</h1>
      {!currentUser && mine.length > 0 && <p className="mu" style={{ marginBottom: 12 }}>Showing guest orders. <Link to="/login?next=/orders" style={{ color: 'var(--p)' }}><b>Log in</b></Link> to see your account orders.</p>}
      {!mine.length ? (
        <div className="empty"><h2>No orders yet</h2><p className="mu">{currentUser ? 'Place your first order and it will show up here.' : 'Orders placed as a guest on this browser appear here. Log in to see your account orders.'}</p><Link className="btn" to="/shop">Start Shopping</Link></div>
      ) : mine.map(o => {
        const s = STATUSES.indexOf(o.status);
        return (
          <article className="ocard" key={o.id}>
            <div className="ohead">
              <div><b>{o.id}</b><br /><span className="mu">Ordered {fmtDate(o.date)}</span></div>
              <div><span className="pill">{o.status}</span></div>
              <div><b>{rupee(o.totals.total)}</b><br /><span className="mu">{o.payment.method}: {o.payment.status}</span></div>
            </div>
            {o.items.map((i, k) => <div className="mini" key={k}><Img src={i.image} alt={i.name} /><span>{i.name}<br /><small className="mu">Qty {i.qty}</small></span><b>{rupee(i.price * i.qty)}</b></div>)}
            <ol className="steps">{STATUSES.map((t, i) => <li key={t} className={i <= s ? 'done' : ''}>{t}</li>)}</ol>
            <div className="ohead">
              <span className="mu">{s === 4 ? 'Delivered' : 'Estimated delivery: ' + fmtDate(o.estimatedDelivery)}</span>
              {s < 4 && <button className="btn ghost" onClick={() => advanceOrder(o.id)}>Advance status (demo)</button>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
