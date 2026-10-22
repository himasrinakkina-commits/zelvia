import React from 'react';
import { Link } from 'react-router-dom';
import { getProduct } from '../data/products.js';
import { rupee, stars, useTitle } from '../data/utils.js';
import { useStore } from '../context/StoreContext.jsx';
import Img from '../components/Img.jsx';

export default function Wishlist() {
  useTitle('My Wishlist');
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const list = wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="wrap sec">
      <h1 className="sh">My wishlist</h1>
      <div className="pg">
        {list.length ? list.map(p => (
          <article className="card" key={p.id}>
            <Link className="im" to={'/product/' + p.id}><Img src={p.images[0]} alt={p.name} width="300" height="300" /></Link>
            <div className="cb">
              <h3><Link to={'/product/' + p.id}>{p.name}</Link></h3>
              <div className="rt">{stars(p.rating)} <span className="mu">{p.rating}</span></div>
              <div className="pr"><b>{rupee(p.salePrice)}</b><s>{rupee(p.price)}</s></div>
              <div className={'stk ' + (p.stock > 0 ? 'ok' : 'er')}>{p.stockStatus}</div>
              <div className="act">
                <button className="btn" disabled={p.stock <= 0} onClick={() => addToCart(p.id)}>{p.stock > 0 ? 'Add to Cart' : 'Out of stock'}</button>
                <button className="ib wb" aria-label="Remove from wishlist" onClick={() => toggleWishlist(p.id)}>✕</button>
              </div>
            </div>
          </article>
        )) : <div className="empty"><h2>Your wishlist is empty</h2><p className="mu">Tap the heart on any product to save it here.</p><Link className="btn" to="/shop">Continue Shopping</Link></div>}
      </div>
    </div>
  );
}
