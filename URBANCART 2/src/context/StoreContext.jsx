import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProduct } from '../data/products.js';
import { hashPw } from '../data/utils.js';

/* Global state (cart, wishlist, auth, orders, theme, toasts), persisted in LocalStorage */
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export const COUPONS = { URBAN10: { pct: 10, label: '10% off' }, WELCOME200: { flat: 200, min: 1000, label: '₹200 off on orders above ₹1,000' } };
export const FREE_SHIPPING_ABOVE = 500, SHIPPING_FEE = 100, TAX_RATE = 0.05;

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
/* "Remember me" off: drop the login when the browser session ends */
if (read('sessionOnly', false) && !sessionStorage.getItem('uc_session')) localStorage.removeItem('currentUser');
function usePersist(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

/* Totals are always computed from product data, never hard-coded */
export function calcTotals(source, code) {
  const items = source.map(x => ({ ...x, product: getProduct(x.id) })).filter(x => x.product);
  const subtotal = items.reduce((s, x) => s + x.product.salePrice * x.qty, 0);
  const c = COUPONS[code];
  const discount = c ? (c.pct ? Math.round(subtotal * c.pct / 100) : subtotal >= c.min ? c.flat : 0) : 0;
  const taxable = subtotal - discount;
  const shipping = !subtotal || subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const tax = Math.round(taxable * TAX_RATE);
  return { items, subtotal, discount, shipping, tax, total: taxable + shipping + tax, count: items.reduce((s, x) => s + x.qty, 0) };
}

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersist('cart', []);
  const [wishlist, setWishlist] = usePersist('wishlist', []);
  const [coupon, setCoupon] = usePersist('coupon', '');
  const [orders, setOrders] = usePersist('orders', []);
  const [addresses, setAddresses] = usePersist('addresses', []);
  const [users, setUsers] = usePersist('users', []);
  const [currentUser, setCurrentUser] = usePersist('currentUser', null);
  const [prefs, setPrefs] = usePersist('preferences', { theme: 'light' });
  const [recent, setRecent] = usePersist('recentlyViewed', []);
  const [buyNow, setBuyNow] = usePersist('buyNow', null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { document.documentElement.dataset.theme = prefs.theme; }, [prefs.theme]);
  const toast = useCallback(msg => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);

  const addToCart = (id, qty = 1, opt = {}) => {
    const p = getProduct(id);
    if (!p || p.stock <= 0) { toast('This product is out of stock'); return false; }
    const color = opt.color || null, size = opt.size || null;
    setCart(c => {
      const i = c.findIndex(x => x.id === p.id && x.color === color && x.size === size);
      if (i > -1) return c.map((x, j) => j === i ? { ...x, qty: Math.min(x.qty + qty, p.stock) } : x);
      return [...c, { id: p.id, qty: Math.min(qty, p.stock), color, size }];
    });
    toast('✓ Product added to cart');
    return true;
  };
  const setQty = (i, q) => setCart(c => c.map((x, j) => j === i ? { ...x, qty: Math.max(1, Math.min(q, getProduct(x.id).stock)) } : x));
  const removeFromCart = i => { setCart(c => c.filter((_, j) => j !== i)); toast('Product removed from cart'); };
  const clearCart = () => { setCart([]); setCoupon(''); };
  const applyCoupon = raw => {
    const code = (raw || '').trim().toUpperCase(), c = COUPONS[code];
    if (!c) return { ok: false, msg: 'Invalid coupon code' };
    if (c.min && calcTotals(cart, '').subtotal < c.min) return { ok: false, msg: 'Add items worth ₹' + c.min.toLocaleString('en-IN') + ' to use this coupon' };
    setCoupon(code);
    return { ok: true, msg: code + ' applied: ' + c.label };
  };
  const toggleWishlist = id => {
    const on = !wishlist.includes(id);
    setWishlist(w => on ? [...w, id] : w.filter(x => x !== id));
    toast(on ? '♥ Added to wishlist' : 'Removed from wishlist');
  };

  /* demo authentication: stored only in this browser */
  const register = u => {
    if (users.some(x => x.email === u.email)) return { ok: false, msg: 'An account with this email already exists. Try logging in.' };
    setUsers([...users, { name: u.name, email: u.email, phone: u.phone, password: hashPw(u.password) }]);
    return { ok: true };
  };
  const login = (email, pw, remember) => {
    const u = users.find(x => x.email === email && x.password === hashPw(pw));
    if (!u) return false;
    setCurrentUser({ name: u.name, email: u.email, phone: u.phone });
    localStorage.setItem('sessionOnly', JSON.stringify(!remember));
    sessionStorage.setItem('uc_session', '1');
    return true;
  };
  const logout = () => { setCurrentUser(null); localStorage.removeItem('sessionOnly'); toast('You have been logged out'); };
  const updateProfile = (name, phone) => {
    setUsers(us => us.map(x => x.email === currentUser.email ? { ...x, name, phone } : x));
    setCurrentUser({ ...currentUser, name, phone });
  };
  const changePassword = (cur, next) => {
    const u = users.find(x => x.email === currentUser.email);
    if (!u || u.password !== hashPw(cur)) return false;
    setUsers(us => us.map(x => x.email === u.email ? { ...x, password: hashPw(next) } : x));
    return true;
  };

  const placeOrder = order => {
    setOrders(o => [order, ...o]);
    const a = order.address;
    setAddresses(list => list.some(x => x.house === a.house && x.pin === a.pin) ? list : [{ ...a, name: order.customer.name, phone: order.customer.phone }, ...list]);
  };
  const STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const advanceOrder = id => setOrders(os => os.map(o => {
    if (o.id !== id) return o;
    const status = STATUSES[STATUSES.indexOf(o.status) + 1] || o.status;
    return { ...o, status, payment: status === 'Delivered' && o.payment.method === 'Cash on Delivery' ? { ...o.payment, status: 'Paid' } : o.payment };
  }));

  const value = { cart, wishlist, coupon, orders, addresses, setAddresses, currentUser, prefs, setPrefs, recent, setRecent, buyNow, setBuyNow, toasts, toast,
    addToCart, setQty, removeFromCart, clearCart, applyCoupon, toggleWishlist, register, login, logout, updateProfile, changePassword, placeOrder, advanceOrder, STATUSES };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
