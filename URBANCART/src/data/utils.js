import { useEffect } from 'react';
export const rupee = n => '₹' + Math.round(n).toLocaleString('en-IN');
export const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const RX = { email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, phone: /^[6-9]\d{9}$/, pin: /^[1-9]\d{5}$/, upi: /^[\w.\-]{2,}@[a-zA-Z]{2,}$/ };
export const pwOk = p => p.length >= 6 && /[a-z]/i.test(p) && /\d/.test(p);
/* demo-only hash: NOT secure, just avoids storing plain text */
export const hashPw = s => { let h = 5381; for (const c of s) h = ((h << 5) + h) ^ c.charCodeAt(0); return (h >>> 0).toString(16); };
export const luhn = n => { let s = 0, d = false; for (let i = n.length - 1; i >= 0; i--) { let x = +n[i]; if (d && (x *= 2) > 9) x -= 9; s += x; d = !d; } return s % 10 === 0; };
export const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='100%' height='100%' fill='#eceff4'/><text x='50%' y='50%' fill='#98a2b3' font-family='sans-serif' font-size='32' text-anchor='middle'>UrbanCart</text></svg>");
export const useTitle = t => useEffect(() => { document.title = t + ' | UrbanCart'; }, [t]);
