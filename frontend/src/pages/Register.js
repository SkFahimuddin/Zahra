import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⬡</div>
        <h1 style={styles.title}>CREATE ACCOUNT</h1>
        <p style={styles.sub}>Register for ITAR Defense Supply</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { name: 'name', label: 'FULL NAME', type: 'text', placeholder: 'John Smith' },
            { name: 'email', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'agent@defense.gov' },
            { name: 'password', label: 'PASSWORD', type: 'password', placeholder: '6+ characters' },
            { name: 'confirm', label: 'CONFIRM PASSWORD', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.name} style={styles.group}>
              <label style={styles.label}>{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} required className="input" placeholder={f.placeholder} />
            </div>
          ))}
          <div style={styles.certify}>
            <input type="checkbox" required id="itar" style={{ marginTop: '3px' }} />
            <label htmlFor="itar" style={styles.certifyText}>
              I certify that I am a US person as defined under 22 C.F.R. § 120.15 and agree to comply with all applicable ITAR regulations.
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={styles.submit}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p style={styles.link}>
          Already registered? <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { width: '100%', maxWidth: '440px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '40px' },
  logo: { fontSize: '40px', color: 'var(--gold)', textAlign: 'center', marginBottom: '16px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', textAlign: 'center', marginBottom: '6px' },
  sub: { fontSize: '13px', color: 'var(--text3)', textAlign: 'center', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  group: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)' },
  certify: { display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px' },
  certifyText: { fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, cursor: 'pointer' },
  submit: { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', letterSpacing: '2px' },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text3)' },
};
