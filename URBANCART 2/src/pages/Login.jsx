import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { RX, useTitle } from '../data/utils.js';
import Field, { useForm } from '../components/Field.jsx';

export default function Login() {
  useTitle('Log in');
  const { login, toast } = useStore(), nav = useNavigate(), [sp] = useSearchParams();
  const next = /^\/[\w\-/]*$/.test(sp.get('next') || '') ? sp.get('next') : '/account';
  const f = useForm({ email: '', password: '' }), [remember, setRemember] = useState(false), [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault(); setErr('');
    if (!f.run([['email', v => RX.email.test(v) ? '' : 'Enter a valid email address'], ['password', () => f.v.password ? '' : 'Enter your password']])) return;
    if (login(f.v.email.trim().toLowerCase(), f.v.password, remember)) nav(next);
    else setErr('Invalid email or password. Check your details or create an account.');
  };
  return (
    <div className="wrap"><div className="authbox">
      <h1>Log in</h1><p className="mu">Welcome back to UrbanCart.</p>
      {sp.get('registered') && <div className="msg okc" role="status">Account created. Please log in.</div>}
      <form onSubmit={submit} noValidate>
        <Field label="Email" type="email" autoComplete="email" {...f.bind('email')} />
        <Field label="Password" type="password" autoComplete="current-password" {...f.bind('password')} />
        <label className="chk"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
        <div className="msg erc" role="alert">{err}</div>
        <button className="btn" type="submit">Log in</button>
      </form>
      <p style={{ marginTop: 14, fontSize: 14 }}><button className="link" type="button" style={{ color: 'var(--p)' }} onClick={() => toast('Demo only: password reset is not available. Register with a new email.')}>Forgot password?</button></p>
      <p style={{ fontSize: 14 }}>New to UrbanCart? <Link to="/register"><b>Create an account</b></Link></p>
      <p className="mu" style={{ fontSize: 12, marginTop: 10 }}>Demo login: accounts are stored only in this browser. Do not use real passwords.</p>
    </div></div>
  );
}
