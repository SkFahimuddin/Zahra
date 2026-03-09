import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxUses: '100', expiresAt: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const load = () => { setLoading(true); axios.get('/api/admin/coupons').then(r => setCoupons(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await axios.post('/api/admin/coupons', form);
      toast.success('Coupon created ✦'); setShowForm(false); setForm(EMPTY); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    await axios.delete(`/api/admin/coupons/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '5px', color: 'var(--gold)' }}>MANAGE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', marginTop: '4px' }}>PROMO CODES</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-gold">+ NEW COUPON</button>
      </div>

      {showForm && (
        <div style={{ border: '1px solid var(--border)', padding: '28px', marginBottom: '24px', background: 'var(--surface)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '20px' }}>CREATE COUPON</div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[['CODE', 'code', 'text', 'WELCOME20'], ['DISCOUNT VALUE', 'discountValue', 'number', '20'], ['MIN ORDER ($)', 'minOrderValue', 'number', '0'], ['MAX USES', 'maxUses', 'number', '100']].map(([label, name, type, ph]) => (
              <div key={name}>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} required={name === 'code' || name === 'discountValue'} placeholder={ph} className="input" style={{ textTransform: name === 'code' ? 'uppercase' : undefined }} />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>TYPE</label>
              <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="input">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>EXPIRY DATE</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="input" />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-dark btn-sm">CANCEL</button>
              <button type="submit" disabled={submitting} className="btn btn-gold btn-sm">{submitting ? 'CREATING...' : 'CREATE COUPON'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div> : (
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>CODE</th><th>TYPE</th><th>DISCOUNT</th><th>MIN ORDER</th><th>USED / MAX</th><th>EXPIRES</th><th>STATUS</th><th>ACTION</th></tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id}>
                  <td style={{ fontFamily: 'var(--font-display)', letterSpacing: '3px', color: 'var(--gold)', fontSize: '13px' }}>{c.code}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{c.discountType}</td>
                  <td style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                  <td style={{ fontFamily: 'var(--font-ui)', color: 'var(--text3)' }}>${c.minOrderValue}</td>
                  <td style={{ fontFamily: 'var(--font-ui)', color: 'var(--text3)' }}>{c.usedCount} / {c.maxUses}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td><span className={`badge ${c.active ? 'badge-green' : 'badge-red'}`}>{c.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                  <td><button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">DEL</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!coupons.length && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontStyle: 'italic' }}>No coupons yet.</div>}
        </div>
      )}
    </div>
  );
}
