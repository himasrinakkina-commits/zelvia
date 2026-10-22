import React from 'react';
import { useTitle } from '../data/utils.js';

const TEAM = [['AR', 'Arjun Rao', 'Founder and CEO'], ['SN', 'Sneha Nair', 'Head of Product'], ['KM', 'Karthik Menon', 'Head of Operations'], ['DP', 'Divya Patel', 'Customer Experience']];
const Cards = ({ items }) => <div className="three">{items.map(([t, p]) => <article key={t}><h3>{t}</h3><p className="mu">{p}</p></article>)}</div>;

export default function About() {
  useTitle('About Us');
  return (
    <>
      <section className="hero"><div className="wrap" style={{ gridTemplateColumns: '1fr' }}><div><h1>About UrbanCart</h1><p>We make everyday shopping simple: honest prices, quality products and delivery you can count on.</p></div></div></section>
      <section className="sec wrap"><div className="sh"><h2>Our story</h2></div>
        <p style={{ maxWidth: '70ch' }}>UrbanCart started as a small idea: one store where people can find electronics, fashion, footwear, home essentials, beauty and accessories without comparing ten websites. We pick products carefully, price them fairly and keep checkout short. (UrbanCart is a demo internship project; the company, team and numbers on this page are fictional.)</p>
      </section>
      <section className="sec wrap"><Cards items={[['Our mission', 'To make quality products affordable and shopping stress-free for every household.'], ['Our vision', 'To be the most trusted multi-category store for everyday needs across India.'], ['Customer first', 'Easy returns, clear pricing and support that answers quickly.']]} /></section>
      <section className="sec wrap"><div className="sh"><h2>Why shop with us</h2></div><Cards items={[['Secure shopping', 'Clear checkout and no hidden charges.'], ['Quality products', 'Every listing is checked before it goes live.'], ['Fast delivery', 'Free shipping above ₹500, most orders in 3 to 5 days.']]} /></section>
      <section className="sec wrap"><div className="stats"><div><b>32+</b>Products</div><div><b>6</b>Categories</div><div><b>10k+</b>Happy customers</div><div><b>4.4★</b>Average rating</div></div></section>
      <section className="sec wrap"><div className="sh"><h2>Meet the team</h2></div>
        <div className="team">{TEAM.map(([i, n, r]) => <article key={n}><div className="av">{i}</div><b>{n}</b><p className="mu">{r}</p></article>)}</div>
      </section>
    </>
  );
}
