import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const f = () => setTop(window.scrollY > 500);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <>
      <footer className="ftr">
        <div className="wrap fg">
          <div><div className="logo">UrbanCart</div><p>Everyday essentials across six categories, delivered across India.</p></div>
          <div><h4>Shop</h4><Link to="/shop">All products</Link><Link to="/categories">Categories</Link><Link to="/shop?offers=1">Offers</Link></div>
          <div><h4>Account</h4><Link to="/account">My account</Link><Link to="/orders">Orders</Link><Link to="/wishlist">Wishlist</Link></div>
          <div><h4>Company</h4><Link to="/about">About us</Link><Link to="/contact">Contact us</Link></div>
        </div>
        <div className="wrap copy">© {new Date().getFullYear()} UrbanCart. Demo project; no real payments.</div>
      </footer>
      {top && <button id="toTop" className="btn" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>}
    </>
  );
}
