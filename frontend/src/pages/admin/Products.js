import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', category: '', stock: '', partNumber: '', manufacturer: '', itar: true, featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/products').then(r => setProducts(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImageFile(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, partNumber: p.partNumber || '', manufacturer: p.manufacturer || '', itar: p.itar, featured: p.featured }); setImageFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await axios.put(`/api/admin/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await axios.post('/api/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>PRODUCT MANAGEMENT</h1>
        <button onClick={openAdd} className="btn btn-primary">+ ADD PRODUCT</button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <Field label="PRODUCT NAME *" name="name" value={form.name} onChange={handleChange} required />
                <Field label="CATEGORY *" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Optics, Electronics" />
                <Field label="PRICE (USD) *" name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" />
                <Field label="STOCK *" name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" />
                <Field label="PART NUMBER" name="partNumber" value={form.partNumber} onChange={handleChange} />
                <Field label="MANUFACTURER" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>DESCRIPTION *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="input" rows="3" style={{ resize: 'vertical' }} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>PRODUCT IMAGE</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="input" style={{ paddingTop: '8px' }} />
              </div>

              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" name="itar" checked={form.itar} onChange={handleChange} />
                  ITAR Controlled
                </label>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  Featured on Homepage
                </label>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">CANCEL</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'SAVING...' : editing ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : (
        <div style={styles.tableWrap}>
          <table className="table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>FLAGS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.image
                      ? <img src={`http://localhost:5000${p.image}`} alt={p.name} style={styles.thumb} />
                      : <div style={styles.thumbPlaceholder}>⬡</div>
                    }
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{p.name}</div>
                    {p.partNumber && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)' }}>P/N: {p.partNumber}</div>}
                    {p.manufacturer && <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{p.manufacturer}</div>}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>{p.stock}</span>
                  </td>
                  <td style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {p.itar && <span className="badge badge-gold">ITAR</span>}
                    {p.featured && <span className="badge badge-blue">FEAT</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm">EDIT</button>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm">DEL</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No products yet. Click "+ ADD PRODUCT" to get started.</div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, required, min, step, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)' }}>{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} required={required} min={min} step={step} placeholder={placeholder} className="input" />
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '3px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  modal: { background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: '8px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  modalTitle: { fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '3px' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text3)', fontSize: '18px', cursor: 'pointer' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)' },
  checkboxRow: { display: 'flex', gap: '24px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' },
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' },
  thumb: { width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px', background: 'var(--surface2)' },
  thumbPlaceholder: { width: '44px', height: '44px', background: 'var(--surface2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--border2)', fontSize: '20px' },
};
