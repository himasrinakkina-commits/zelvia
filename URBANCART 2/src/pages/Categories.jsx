import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { useTitle } from '../data/utils.js';

export default function Categories() {
  useTitle('Shop by Category');
  return (
    <div className="wrap sec">
      <h1 className="sh">Shop by category</h1>
      <div className="cats big">
        {CATEGORIES.map(c => (
          <Link key={c.name} className="cat" to={'/shop?category=' + encodeURIComponent(c.name)}>
            <span>{c.icon}</span>{c.name}<small>{PRODUCTS.filter(p => p.category === c.name).length} products</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
