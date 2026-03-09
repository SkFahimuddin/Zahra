import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', originalPrice: '', category: 'Attar', stock: '', volume: '', concentration: 'Pure Attar', featured: false, tags: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const load = () => { setLoading(true); axios.get('/api/admin/products').then(r => setProducts(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFiles([]); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category, stock: p.stock, volume: p.volume || '', concentration: p.concentration || '', featured: p.featured, tags: (p.tags || []).join(', ') });
    setFiles([]); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      if (editing) await axios.put(`/api/admin/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await axios.post('/api/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editing ? 'Product updated ✦' : 'Product added ✦');
      setShowForm(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/admin/products/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '5px', color: 'var(--gold)' }}>MANAGE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', marginTop: '4px' }}>PRODUCTS</h1>
        </div>
        <button onClick={openAdd} className="btn btn-gold">+ ADD PRODUCT</button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'var(--dark)', border: '1px solid var(--border)', width: '100%', maxWidth: '660px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '4px', color: 'var(--cream)' }}>{editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <F label="PRODUCT NAME *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
                <div>
                  <label style={lbl}>CATEGORY *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input" style={{ marginTop: '6px' }}>
                    {['Attar', 'Oud & Bakhoor', 'Gift Sets', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <F label="PRICE (USD) *" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} required min="0" step="0.01" />
                <F label="ORIGINAL PRICE" type="number" value={form.originalPrice} onChange={v => setForm(f => ({ ...f, originalPrice: v }))} min="0" step="0.01" />
                <F label="STOCK *" type="number" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} required min="0" />
                <F label="VOLUME" value={form.volume} onChange={v => setForm(f => ({ ...f, volume: v }))} placeholder="e.g. 12ml" />
                <F label="CONCENTRATION" value={form.concentration} onChange={v => setForm(f => ({ ...f, concentration: v }))} placeholder="Pure Attar" />
                <F label="TAGS (comma separated)" value={form.tags} onChange={v => setForm(f => ({ ...f, tags: v }))} placeholder="oud, dark, smoky" />
              </div>
              <div>
                <label style={lbl}>DESCRIPTION *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required className="input" rows="3" style={{ marginTop: '6px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={lbl}>PRODUCT IMAGES (up to 5)</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} className="input" style={{ marginTop: '6px', paddingTop: '8px' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text2)' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                FEATURE ON HOMEPAGE
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-dark btn-sm">CANCEL</button>
                <button type="submit" disabled={submitting} className="btn btn-gold btn-sm">{submitting ? 'SAVING...' : editing ? 'UPDATE' : 'ADD PRODUCT'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>IMAGE</th><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>RATING</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{ width: '50px', height: '60px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    : <div style={{ width: '50px', height: '60px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--border2)', fontSize: '18px' }}>✦</div>
                  }
                </td>
                <td>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--cream)' }}>{p.name}</div>
                  {p.volume && <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{p.volume}</div>}
                  {p.featured && <span className="badge badge-gold" style={{ marginTop: '4px' }}>FEATURED</span>}
                </td>
                <td style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)' }}>{p.category}</td>
                <td>
                  <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '1px' }}>${p.price}</div>
                  {p.originalPrice > p.price && <div style={{ fontSize: '11px', color: 'var(--text3)', textDecoration: 'line-through' }}>${p.originalPrice}</div>}
                </td>
                <td><span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>{p.stock}</span></td>
                <td style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '12px' }}>{p.avgRating > 0 ? `★ ${p.avgRating}` : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(p)} className="btn btn-dark btn-sm">EDIT</button>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm">DEL</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && !loading && <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text3)', fontStyle: 'italic' }}>No products yet. Add your first fragrance.</div>}
      </div>
    </div>
  );
}

const lbl = { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', display: 'block' };
function F({ label, value, onChange, type = 'text', required, min, step, placeholder }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} min={min} step={step} placeholder={placeholder} className="input" style={{ marginTop: '6px' }} />
    </div>
  );
}
