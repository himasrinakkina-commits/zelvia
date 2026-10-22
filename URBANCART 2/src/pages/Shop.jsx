import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { useTitle } from '../data/utils.js';
import ProductCard from '../components/ProductCard.jsx';

const PRICES = [['', 'Any price'], ['0-1000', '₹0 – ₹1,000'], ['1000-5000', '₹1,000 – ₹5,000'], ['5000-10000', '₹5,000 – ₹10,000'], ['10000-', '₹10,000+']];
const SORTS = {
  plh: (a, b) => a.salePrice - b.salePrice, phl: (a, b) => b.salePrice - a.salePrice, new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating, pop: (a, b) => b.popularity - a.popularity
};
const INITIAL = { sub: 'All', price: '', rating: 0, stock: [], min: '', max: '' };

export default function Shop() {
  useTitle('Shop All Products');
  const [sp] = useSearchParams(), nav = useNavigate();
  const [F, setF] = useState({ ...INITIAL, cat: sp.get('category') || 'All' });
  const [sort, setSort] = useState('featured'), [open, setOpen] = useState(false);
  const set = (k, v) => setF(f => ({ ...f, [k]: v }));
  useEffect(() => { set('cat', sp.get('category') || 'All'); }, [sp.get('category')]);

  const terms = (sp.get('q') || '').toLowerCase().split(/\s+/).filter(Boolean), offers = sp.get('offers') === '1';
  let [min, max] = F.price ? F.price.split('-').map(v => v === '' ? Infinity : +v) : [0, Infinity];
  const lo = parseFloat(F.min), hi = parseFloat(F.max);
  if (!isNaN(lo)) min = Math.max(min, lo);
  if (!isNaN(hi)) max = Math.min(max, hi);
  const anyStock = F.stock.length !== 1;
  const list = PRODUCTS.filter(p => {
    const hay = (p.name + ' ' + p.category + ' ' + p.subCategory + ' ' + p.description).toLowerCase();
    return terms.every(t => hay.includes(t)) && (F.cat === 'All' || p.category === F.cat) && (F.sub === 'All' || p.subCategory === F.sub)
      && p.salePrice >= min && p.salePrice <= max && (!F.rating || (F.rating === 5 ? p.rating >= 4.5 : p.rating >= F.rating))
      && (anyStock || (F.stock[0] === 'in') === (p.stock > 0)) && (!offers || p.discount >= 35);
  });
  if (SORTS[sort]) list.sort(SORTS[sort]);

  const radios = (title, name, opts) => (
    <fieldset><legend>{title}</legend>
      {opts.map(([v, l]) => <label key={v}><input type="radio" name={name} checked={String(F[name]) === String(v)} onChange={() => set(name, name === 'rating' ? +v : v)} />{l}</label>)}
    </fieldset>
  );
  const toggleStock = v => set('stock', F.stock.includes(v) ? F.stock.filter(x => x !== v) : [...F.stock, v]);
  const clearAll = () => { setF({ ...INITIAL, cat: 'All' }); nav('/shop'); };

  return (
    <div className="wrap shop">
      <aside className={'side' + (open ? ' open' : '')} aria-label="Filters">
        {radios('Category', 'cat', [['All', 'All'], ...CATEGORIES.map(c => [c.name, c.name])])}
        {radios('Fashion type', 'sub', [['All', 'All'], ['Men', 'Men'], ['Women', 'Women']])}
        {radios('Price', 'price', PRICES)}
        <fieldset><legend>Custom price (₹)</legend>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" min="0" placeholder="Min" aria-label="Minimum price" value={F.min} onChange={e => set('min', e.target.value)} />
            <input type="number" min="0" placeholder="Max" aria-label="Maximum price" value={F.max} onChange={e => set('max', e.target.value)} />
          </div>
        </fieldset>
        {radios('Rating', 'rating', [[0, 'Any rating'], [5, '5 stars'], [4, '4+ stars'], [3, '3+ stars']])}
        <fieldset><legend>Availability</legend>
          <label><input type="checkbox" checked={F.stock.includes('in')} onChange={() => toggleStock('in')} />In stock</label>
          <label><input type="checkbox" checked={F.stock.includes('out')} onChange={() => toggleStock('out')} />Out of stock</label>
        </fieldset>
        <button className="btn ghost" style={{ width: '100%' }} onClick={clearAll}>Clear filters</button>
      </aside>
      <section>
        <h1 className="sh" style={{ marginBottom: 8 }}>Shop</h1>
        <div className="bar">
          <span className="mu" role="status">{list.length} product{list.length === 1 ? '' : 's'}{offers ? ' on offer' : ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" id="fbtn" onClick={() => setOpen(!open)}>Filters</button>
            <select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Featured</option><option value="plh">Price: Low to High</option><option value="phl">Price: High to Low</option>
              <option value="new">Newest</option><option value="rating">Rating</option><option value="pop">Popularity</option>
            </select>
          </div>
        </div>
        <div className="pg">
          {list.length ? list.map(p => <ProductCard key={p.id} p={p} />) : (
            <div className="empty"><h2>No products found</h2><p className="mu">Try a different search or remove some filters.</p><button className="btn" onClick={clearAll}>Clear all filters</button></div>
          )}
        </div>
      </section>
    </div>
  );
}
