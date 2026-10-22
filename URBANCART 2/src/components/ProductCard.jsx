import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { rupee, stars } from '../data/utils.js';
import Img from './Img.jsx';

export default function ProductCard({ p }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const out = p.stock <= 0, wished = wishlist.includes(p.id), url = '/product/' + p.id;
  return (
    <article className="card">
      <Link className="im" to={url}><Img src={p.images[0]} alt={p.name} width="300" height="300" /><span className="tag">{p.discount}% off</span></Link>
      <div className="cb">
        <small className="mu">{p.category}</small>
        <h3><Link to={url}>{p.name}</Link></h3>
        <div className="rt">{stars(p.rating)} <span className="mu">{p.rating} ({p.reviews.toLocaleString('en-IN')})</span></div>
        <p className="ds">{p.description}</p>
        <div className="pr"><b>{rupee(p.salePrice)}</b><s>{rupee(p.price)}</s></div>
        <div className={'stk ' + (out ? 'er' : 'ok')}>{p.stockStatus}</div>
        <div className="act">
          <button className="btn" disabled={out} onClick={() => addToCart(p.id)}>{out ? 'Out of stock' : 'Add to Cart'}</button>
          <button className={'ib wb' + (wished ? ' on' : '')} aria-label="Toggle wishlist" onClick={() => toggleWishlist(p.id)}>{wished ? '♥' : '♡'}</button>
        </div>
        <Link className="vd" to={url}>View details</Link>
      </div>
    </article>
  );
}
