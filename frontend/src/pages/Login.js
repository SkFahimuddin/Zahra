import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⬡</div>
        <h1 style={styles.title}>ACCESS PORTAL</h1>
        <p style={styles.sub}>Sign in to your ITAR account</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="agent@defense.gov" />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>PASSWORD</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={styles.submit}>
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>
        <p style={styles.link}>
          No account? <Link to="/register" style={{ color: 'var(--gold)' }}>Create one</Link>
        </p>
        <div style={styles.notice}>
          <span>⚠</span> Access is restricted to US persons only. Unauthorized access is prohibited.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)' },
  card: { width: '100%', maxWidth: '420px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '40px' },
  logo: { fontSize: '40px', color: 'var(--gold)', textAlign: 'center', marginBottom: '16px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', textAlign: 'center', marginBottom: '6px' },
  sub: { fontSize: '13px', color: 'var(--text3)', textAlign: 'center', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  group: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)' },
  submit: { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', marginTop: '8px', letterSpacing: '2px' },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text3)' },
  notice: { marginTop: '20px', padding: '12px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: '4px', fontSize: '11px', color: 'var(--text3)', display: 'flex', gap: '8px', lineHeight: 1.6 },
};
