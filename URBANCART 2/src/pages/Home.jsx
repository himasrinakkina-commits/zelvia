import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { RX, stars, useTitle } from '../data/utils.js';
import ProductCard from '../components/ProductCard.jsx';
import Img from '../components/Img.jsx';

const REVIEWS = [
  ['AK', 'Ananya K.', 5, 'The headphones arrived in two days and sound far better than the price suggests.'],
  ['RS', 'Rahul S.', 4, 'Good fit on the jeans and a smooth checkout. Sizes run slightly snug.'],
  ['PM', 'Priya M.', 5, 'Love the Vitamin C serum. Packaging was neat and delivery was on time.']
];

export default function Home() {
  useTitle('Upgrade Your Everyday');
  const [email, setEmail] = useState(''), [msg, setMsg] = useState(null);
  const byPop = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity);
  const featured = PRODUCTS.filter(p => p.stock > 0).sort((a, b) => b.discount - a.discount).slice(0, 8);
  const subscribe = e => {
    e.preventDefault();
    const ok = RX.email.test(email.trim());
    setMsg({ ok, text: ok ? 'Thanks for subscribing! Check your inbox for a welcome offer.' : 'Enter a valid email address, like name@example.com.' });
    if (ok) setEmail('');
  };
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <h1>Upgrade Your Everyday</h1>
          <p>Discover products you'll love at prices you'll appreciate. Six categories, one simple checkout.</p>
          <div className="row"><Link className="btn" to="/shop">Shop Now</Link><Link className="btn ghost" to="/categories">Explore Categories</Link></div>
        </div>
        <div className="collage">{byPop.slice(0, 3).map(p => <Link key={p.id} to={'/product/' + p.id}><Img src={p.images[0]} alt={p.name} /></Link>)}</div>
      </div></section>
      <section className="sec wrap"><div className="sh"><h2>Shop by category</h2></div>
        <div className="cats">{CATEGORIES.map(c => <Link key={c.name} className="cat" to={'/shop?category=' + encodeURIComponent(c.name)}><span>{c.icon}</span>{c.name}</Link>)}</div>
      </section>
      <section className="sec wrap"><div className="sh"><h2>Featured products</h2><Link to="/shop">View all</Link></div>
        <div className="pg">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section className="sec wrap"><div className="offer">
        <div><h2>Mega Sale: up to 50% OFF</h2><p>Top deals across electronics, fashion and home.</p></div>
        <Link className="btn" to="/shop?offers=1">Shop Offers</Link>
      </div></section>
      <section className="sec wrap"><div className="sh"><h2>Best sellers</h2><Link to="/shop">View all</Link></div>
        <div className="pg">{byPop.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section className="sec wrap"><div className="sh"><h2>What customers say</h2></div>
        <div className="rv">{REVIEWS.map(([ini, name, r, text]) => (
          <article key={name}><div className="who"><div className="av">{ini}</div><div><b>{name}</b><div className="rt">{stars(r)}</div></div></div><p>{text}</p></article>
        ))}</div>
      </section>
      <section className="sec wrap"><div className="news">
        <h2>Get deals in your inbox</h2><p className="mu">Subscribe for new arrivals and coupon codes.</p>
        <form onSubmit={subscribe} noValidate>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" />
          <button className="btn" type="submit">Subscribe</button>
        </form>
        <p className={'msg ' + (msg ? (msg.ok ? 'okc' : 'erc') : '')} role="status">{msg && msg.text}</p>
      </div></section>
    </>
  );
}
