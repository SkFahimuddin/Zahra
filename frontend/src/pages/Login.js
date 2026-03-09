import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome, ${u.name} ✦`);
      navigate(u.role === 'admin' ? '/admin' : '/');
    } catch (e) { toast.error(e.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.ornament}>✦</div>
        <h1 style={s.title}>WELCOME BACK</h1>
        <p style={s.sub}>Sign in to your ITAR account</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="EMAIL" name="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
          <Field label="PASSWORD" name="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
          <button type="submit" disabled={loading} className="btn btn-gold" style={s.submit}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</button>
        </form>
        <p style={s.link}>New to ITAR? <Link to="/register" style={{ color: 'var(--gold)' }}>Create an account</Link></p>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to ITAR ✦');
      navigate('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.ornament}>✦</div>
        <h1 style={s.title}>JOIN ITAR</h1>
        <p style={s.sub}>Create your account to begin</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="FULL NAME" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" />
          <Field label="EMAIL" name="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
          <Field label="PASSWORD" name="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="6+ characters" />
          <Field label="CONFIRM PASSWORD" name="confirm" type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" />
          <button type="submit" disabled={loading} className="btn btn-gold" style={s.submit}>{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</button>
        </form>
        <p style={s.link}>Already a member? <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link></p>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)' }}>{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder} className="input" />
    </div>
  );
}

const s = {
  page: { minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)' },
  card: { width: '100%', maxWidth: '400px', border: '1px solid var(--border)', padding: '48px 40px', background: 'var(--surface)' },
  ornament: { textAlign: 'center', fontSize: '24px', color: 'var(--gold)', letterSpacing: '8px', marginBottom: '20px', opacity: 0.7 },
  title: { fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '6px', textAlign: 'center', marginBottom: '8px', color: 'var(--cream)' },
  sub: { fontSize: '14px', color: 'var(--text3)', textAlign: 'center', fontStyle: 'italic', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  submit: { width: '100%', padding: '14px', letterSpacing: '4px', marginTop: '8px' },
  link: { textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' },
};

export default Login;
