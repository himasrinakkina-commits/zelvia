import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { RX, pwOk, useTitle } from '../data/utils.js';
import Field, { useForm } from '../components/Field.jsx';

export default function Register() {
  useTitle('Create Account');
  const { register } = useStore(), nav = useNavigate();
  const f = useForm({ name: '', email: '', phone: '', password: '', confirm: '' }), [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault(); setErr('');
    const pw = f.v.password;
    if (!f.run([['name', v => v.length < 2 ? 'Enter your full name' : ''], ['email', v => RX.email.test(v) ? '' : 'Enter a valid email address'], ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number'],
      ['password', () => pwOk(pw) ? '' : 'Use at least 6 characters with a letter and a number'], ['confirm', () => f.v.confirm === pw ? '' : 'Passwords do not match']])) return;
    const r = register({ name: f.v.name.trim(), email: f.v.email.trim().toLowerCase(), phone: f.v.phone.trim(), password: pw });
    if (!r.ok) { setErr(r.msg); return; }
    nav('/login?registered=1');
  };
  return (
    <div className="wrap"><div className="authbox">
      <h1>Create account</h1><p className="mu">Takes less than a minute.</p>
      <form onSubmit={submit} noValidate>
        <Field label="Full name" autoComplete="name" {...f.bind('name')} />
        <Field label="Email" type="email" autoComplete="email" {...f.bind('email')} />
        <Field label="Mobile number" type="tel" maxLength="10" inputMode="numeric" {...f.bind('phone')} />
        <Field label="Password" type="password" autoComplete="new-password" {...f.bind('password')} />
        <Field label="Confirm password" type="password" autoComplete="new-password" {...f.bind('confirm')} />
        <div className="msg erc" role="alert">{err}</div>
        <button className="btn" type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 14, fontSize: 14 }}>Already have an account? <Link to="/login"><b>Log in</b></Link></p>
      <p className="mu" style={{ fontSize: 12, marginTop: 10 }}>Demo registration: details are stored only in this browser.</p>
    </div></div>
  );
}
