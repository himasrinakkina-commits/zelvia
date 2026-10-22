import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { RX, useTitle } from '../data/utils.js';
import Field, { useForm } from '../components/Field.jsx';

const BLANK = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  useTitle('Contact Us');
  const { toast } = useStore(), f = useForm(BLANK), [sent, setSent] = useState(false);
  const submit = e => {
    e.preventDefault(); setSent(false);
    if (!f.run([['name', v => v.length < 2 ? 'Enter your name' : ''], ['email', v => RX.email.test(v) ? '' : 'Enter a valid email address'], ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit phone number'],
      ['subject', v => v.length < 3 ? 'Enter a subject' : ''], ['message', v => v.length < 10 ? 'Message must be at least 10 characters' : '']])) return;
    let all = []; try { all = JSON.parse(localStorage.getItem('contactMessages')) || []; } catch { /* ignore */ }
    localStorage.setItem('contactMessages', JSON.stringify([...all, { ...f.v, date: new Date().toISOString() }]));
    f.setV(BLANK); setSent(true); toast('✓ Message sent');
  };
  return (
    <div className="wrap ci">
      <section>
        <h1>Contact us</h1><p className="mu" style={{ marginBottom: 16 }}>Questions about an order or product? Send us a message.</p>
        <form onSubmit={submit} noValidate>
          <Field label="Name" {...f.bind('name')} />
          <div className="two"><Field label="Email" type="email" {...f.bind('email')} /><Field label="Phone" type="tel" maxLength="10" inputMode="numeric" {...f.bind('phone')} /></div>
          <Field label="Subject" {...f.bind('subject')} />
          <Field label="Message" as="textarea" rows="5" {...f.bind('message')} />
          <button className="btn" type="submit">Send message</button>
        </form>
        <div className="msg okc" role="status">{sent && 'Thank you! Your message has been sent. We will reply within 1 to 2 working days.'}</div>
      </section>
      <aside>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Get in touch</h2>
        <ul><li>Email: <a href="mailto:support@urbancart.example">support@urbancart.example</a></li><li>Phone: <a href="tel:+919000000000">+91 90000 00000</a></li><li>Address: UrbanCart HQ, Madhapur, Hyderabad, Telangana 500081</li><li>Hours: Mon to Sat, 9 AM to 6 PM</li></ul>
        <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>Follow us</h2>
        <ul><li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li><li><a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li></ul>
      </aside>
    </div>
  );
}
