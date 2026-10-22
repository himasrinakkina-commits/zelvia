import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { RX, fmtDate, pwOk, rupee, useTitle } from '../data/utils.js';
import { getProduct } from '../data/products.js';
import Field, { useForm } from '../components/Field.jsx';
import Img from '../components/Img.jsx';

const TITLES = { profile: 'My Profile', orders: 'My Orders', wishlist: 'Wishlist', addresses: 'Saved Addresses', password: 'Change Password' };
const Empty = ({ t, p, label, to }) => <div className="empty" style={{ border: 0 }}><h2>{t}</h2><p className="mu">{p}</p><Link className="btn" to={to}>{label}</Link></div>;

function Profile() {
  const { currentUser: u, updateProfile, toast } = useStore();
  const f = useForm({ name: u.name, phone: u.phone });
  const submit = e => {
    e.preventDefault();
    if (!f.run([['name', v => v.length < 2 ? 'Enter your full name' : ''], ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number']])) return;
    updateProfile(f.v.name.trim(), f.v.phone.trim()); toast('✓ Profile updated');
  };
  return (
    <form onSubmit={submit} noValidate>
      <Field label="Full name" {...f.bind('name')} />
      <Field id="email" label="Email" type="email" value={u.email} disabled readOnly />
      <Field label="Mobile number" type="tel" maxLength="10" inputMode="numeric" {...f.bind('phone')} />
      <button className="btn" type="submit">Save changes</button>
    </form>
  );
}
function Password() {
  const { changePassword, toast } = useStore();
  const f = useForm({ cur: '', nw: '', cf: '' });
  const submit = e => {
    e.preventDefault();
    if (!f.run([['cur', v => v ? '' : 'Enter your current password'], ['nw', v => pwOk(v) ? '' : 'Use at least 6 characters with a letter and a number'], ['cf', v => v === f.v.nw ? '' : 'Passwords do not match']])) return;
    if (!changePassword(f.v.cur, f.v.nw)) { f.setErrors({ cur: 'Current password is incorrect' }); return; }
    f.setV({ cur: '', nw: '', cf: '' }); toast('✓ Password updated');
  };
  return (
    <form onSubmit={submit} noValidate>
      <Field label="Current password" type="password" autoComplete="current-password" {...f.bind('cur')} />
      <Field label="New password" type="password" autoComplete="new-password" {...f.bind('nw')} />
      <Field label="Confirm new password" type="password" autoComplete="new-password" {...f.bind('cf')} />
      <button className="btn" type="submit">Update password</button>
    </form>
  );
}

export default function Account() {
  useTitle('My Account');
  const { currentUser: u, orders, wishlist, addresses, setAddresses, logout, toast } = useStore();
  const { hash } = useLocation();
  if (!u) return <Navigate to="/login?next=/account" replace />;
  const k = TITLES[hash.slice(1)] ? hash.slice(1) : 'profile';
  const mine = orders.filter(o => o.userEmail === u.email), wl = wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="wrap acc">
      <nav className="acc-nav" aria-label="Account sections">
        <p className="mu" style={{ padding: '6px 12px', fontSize: 13 }}>Hi, {u.name.split(' ')[0]}</p>
        {Object.entries(TITLES).map(([h, t]) => <Link key={h} to={'#' + h} className={h === k ? 'on' : ''}>{t}</Link>)}
        <button className="link" style={{ color: 'var(--er)' }} onClick={logout}>Logout</button>
      </nav>
      <section className="accbox">
        <h1>{TITLES[k]}</h1>
        {k === 'profile' && <Profile />}
        {k === 'password' && <Password />}
        {k === 'orders' && (mine.length ? <>{mine.slice(0, 3).map(o => <div className="mini" key={o.id}><span><b>{o.id}</b><br /><small className="mu">{fmtDate(o.date)} / {o.items.length} item(s)</small></span><span className="pill">{o.status}</span><b>{rupee(o.totals.total)}</b></div>)}<p style={{ marginTop: 14 }}><Link className="btn" to="/orders">View all orders</Link></p></>
          : <Empty t="No orders yet" p="Your orders will appear here after checkout." label="Start Shopping" to="/shop" />)}
        {k === 'wishlist' && (wl.length ? <>{wl.slice(0, 5).map(p => <div className="mini" key={p.id}><Img src={p.images[0]} alt={p.name} /><span><Link to={'/product/' + p.id}>{p.name}</Link></span><b>{rupee(p.salePrice)}</b></div>)}<p style={{ marginTop: 14 }}><Link className="btn" to="/wishlist">Open wishlist</Link></p></>
          : <Empty t="Your wishlist is empty" p="Save products you like for later." label="Continue Shopping" to="/shop" />)}
        {k === 'addresses' && (addresses.length ? <>{addresses.map((a, i) => <div className="mini" key={i}><span><b>{a.name}</b> ({a.phone})<br /><small className="mu">{a.house}, {a.street}, {a.city}, {a.state} {a.pin}, {a.country}</small></span><button className="link" onClick={() => { setAddresses(list => list.filter((_, j) => j !== i)); toast('Address deleted'); }}>Delete</button></div>)}<p className="mu" style={{ fontSize: 13, marginTop: 10 }}>Addresses are saved automatically when you place an order.</p></>
          : <Empty t="No saved addresses" p="An address is saved the first time you check out." label="Go Shopping" to="/shop" />)}
      </section>
    </div>
  );
}
