import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

const LINKS = [['/', 'Home'], ['/shop', 'Shop'], ['/categories', 'Categories'], ['/shop?offers=1', 'Offers'], ['/about', 'About'], ['/contact', 'Contact']];

export default function Header() {
  const { cart, wishlist, currentUser, prefs, setPrefs } = useStore();
  const [open, setOpen] = useState(false), [q, setQ] = useState('');
  const nav = useNavigate(), loc = useLocation();
  const onShop = loc.pathname === '/shop', sp = new URLSearchParams(loc.search);
  const value = onShop ? sp.get('q') || '' : q;
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const active = l => l.split('?')[0] === loc.pathname && l.includes('offers') === loc.search.includes('offers');
  /* on the shop page the header search filters live through the URL */
  const change = e => { const v = e.target.value; if (onShop) { v ? sp.set('q', v) : sp.delete('q'); nav('/shop?' + sp.toString(), { replace: true }); } else setQ(v); };
  const submit = e => { e.preventDefault(); if (!onShop) nav('/shop?q=' + encodeURIComponent(q.trim())); };

  return (
    <header className="hdr"><div className="wrap">
      <button className="ib burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      <Link className="logo" to="/">UrbanCart</Link>
      <form className="search" role="search" onSubmit={submit}>
        <input type="search" value={value} onChange={change} placeholder="Search products, categories…" aria-label="Search products" autoComplete="off" />
      </form>
      <nav className={'nav' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        {LINKS.map(([l, t]) => <Link key={l} to={l} className={active(l) ? 'on' : ''}>{t}</Link>)}
      </nav>
      <div className="icons">
        <button className="ib" aria-label="Toggle dark mode" onClick={() => setPrefs({ ...prefs, theme: prefs.theme === 'dark' ? 'light' : 'dark' })}>🌓</button>
        <Link className="ib" to={currentUser ? '/account' : '/login'} aria-label="Account">👤</Link>
        <Link className="ib" to="/wishlist" aria-label="Wishlist">♡{wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}</Link>
        <Link className="ib" to="/cart" aria-label="Cart">🛒{cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
      </div>
    </div></header>
  );
}
