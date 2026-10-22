import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PRODUCTS, getProduct } from '../data/products.js';
import { rupee, stars, useTitle } from '../data/utils.js';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Img from '../components/Img.jsx';

export default function ProductDetails() {
  const { id } = useParams(), p = getProduct(id), nav = useNavigate();
  const { addToCart, wishlist, toggleWishlist, recent, setRecent, setBuyNow, toast } = useStore();
  const [cur, setCur] = useState(0), [qty, setQty] = useState(1), [color, setColor] = useState(null), [size, setSize] = useState(null);
  const [lb, setLb] = useState(false), [origin, setOrigin] = useState('50% 50%');
  const n = p ? p.images.length : 0, go = d => setCur(c => (c + d + n) % n);
  useTitle(p ? p.name : 'Product not found');

  useEffect(() => {
    if (!p) return;
    setCur(0); setQty(1); setColor(p.colors[0] || null); setSize(null);
    setRecent(r => [p.id, ...r.filter(x => x !== p.id)].slice(0, 8));
  }, [id]);
  useEffect(() => {
    if (!lb) return;
    const key = e => { if (e.key === 'Escape') setLb(false); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lb, n]);

  if (!p) return <div className="wrap sec"><div className="empty"><h2>Product not found</h2><p className="mu">This link is invalid or the product is no longer available.</p><Link className="btn" to="/shop">Continue Shopping</Link></div></div>;

  const out = p.stock <= 0, wished = wishlist.includes(p.id);
  const ready = () => { if (p.sizes.length && !size) { toast('Please select a size'); return false; } return true; };
  const changeQty = v => { setQty(Math.max(1, Math.min(v, p.stock))); if (v > p.stock) toast('Only ' + p.stock + ' available'); };
  const buyNow = () => { if (!ready()) return; setBuyNow({ id: p.id, qty, color, size }); nav('/checkout?buy=1'); };
  const chips = (list, sel, onPick) => <div className="chips">{list.map(v => <button key={v} className={'chip' + (v === sel ? ' on' : '')} onClick={() => onPick(v)}>{v}</button>)}</div>;
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const viewed = recent.filter(x => x !== p.id).map(getProduct).filter(Boolean).slice(0, 4);

  return (
    <>
      <div className="wrap sec">
        <nav className="crumb mu"><Link to="/">Home</Link> / <Link to={'/shop?category=' + encodeURIComponent(p.category)}>{p.category}</Link> / {p.name}</nav>
        <div className="pdg">
          <div>
            <button className="mainimg" aria-label="Enlarge image" onClick={() => setLb(true)}
              onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%'); }}>
              <Img src={p.images[cur]} alt={p.name} style={{ transformOrigin: origin }} />
            </button>
            <div className="thumbs">{p.images.map((s, i) => <button key={i} className={'th' + (i === cur ? ' on' : '')} aria-label={'Show image ' + (i + 1)} onClick={() => setCur(i)}><Img src={s} alt={p.name + ' view ' + (i + 1)} /></button>)}</div>
          </div>
          <div className="info">
            <small className="mu">{p.category}{p.subCategory ? ' / ' + p.subCategory : ''}</small>
            <h1>{p.name}</h1>
            <div className="rt">{stars(p.rating)} <span className="mu">{p.rating} ({p.reviews.toLocaleString('en-IN')} reviews)</span></div>
            <div className="pr big"><b>{rupee(p.salePrice)}</b><s>{rupee(p.price)}</s><span className="off">{p.discount}% off</span></div>
            <p>{p.description}</p>
            <div className={'stk ' + (out ? 'er' : 'ok')}>{p.stockStatus}</div>
            {p.colors.length > 0 && <div className="opt"><b>Color</b>{chips(p.colors, color, setColor)}</div>}
            {p.sizes.length > 0 && <div className="opt"><b>Size</b>{chips(p.sizes, size, setSize)}</div>}
            <div className="opt"><b>Quantity</b>
              <div className="qty"><button aria-label="Decrease quantity" onClick={() => changeQty(qty - 1)}>−</button><span>{qty}</span><button aria-label="Increase quantity" onClick={() => changeQty(qty + 1)}>+</button></div>
            </div>
            <div className="act2">
              <button className="btn" disabled={out} onClick={() => ready() && addToCart(p.id, qty, { color, size })}>{out ? 'Out of stock' : 'Add to Cart'}</button>
              <button className="btn ghost" disabled={out} onClick={buyNow}>Buy Now</button>
              <button className={'ib wb' + (wished ? ' on' : '')} aria-label="Toggle wishlist" onClick={() => toggleWishlist(p.id)}>{wished ? '♥' : '♡'}</button>
            </div>
            <h2 style={{ fontSize: 18, marginTop: 8 }}>Specifications</h2>
            <table className="spec"><tbody>{Object.entries(p.specifications).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="sec wrap"><div className="sh"><h2>You may also like</h2></div><div className="pg">{related.map(x => <ProductCard key={x.id} p={x} />)}</div></section>}
      {viewed.length > 0 && <section className="sec wrap"><div className="sh"><h2>Recently viewed</h2></div><div className="pg">{viewed.map(x => <ProductCard key={x.id} p={x} />)}</div></section>}
      {lb && (
        <div className="lb" onClick={e => e.target === e.currentTarget && setLb(false)}>
          <button className="x" aria-label="Close" onClick={() => setLb(false)}>✕</button>
          <button aria-label="Previous" onClick={() => go(-1)}>‹</button>
          <Img src={p.images[cur]} alt={p.name} />
          <button aria-label="Next" onClick={() => go(1)}>›</button>
        </div>
      )}
    </>
  );
}
