import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', state: '', zip: '', country: 'United States', notes: '' });

  const items = cart.items || [];

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ product: i.product._id, quantity: i.quantity }));
      const res = await axios.post('/api/orders', {
        items: orderItems,
        shippingAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
        notes: form.notes
      });
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '32px' }}>CHECKOUT</h1>
        <div style={styles.layout}>
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>SHIPPING ADDRESS</div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>STREET ADDRESS *</label>
                  <input name="street" value={form.street} onChange={handleChange} required className="input" placeholder="123 Defense Ave" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CITY *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="input" placeholder="Washington" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>STATE *</label>
                  <input name="state" value={form.state} onChange={handleChange} required className="input" placeholder="DC" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ZIP CODE *</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required className="input" placeholder="20001" />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>COUNTRY *</label>
                  <select name="country" value={form.country} onChange={handleChange} className="input">
                    <option>United States</option>
                  </select>
                  <span style={styles.fieldNote}>ITAR items can only be shipped to US addresses</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>ORDER NOTES</div>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="input" rows="3" placeholder="Special instructions, contract numbers, etc." style={{ resize: 'vertical' }} />
            </div>

            <div style={styles.itarSection}>
              <strong style={{ color: 'var(--red2)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px' }}>⚠ ITAR CERTIFICATION</strong>
              <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px', lineHeight: 1.7 }}>
                By placing this order, I certify that I am a US person (citizen, permanent resident, or protected individual) as defined under 22 C.F.R. § 120.15, that I will not export, re-export, or transfer these items without prior authorization from the US Department of State, and that all end-use will comply with applicable US export control laws.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '24px', fontSize: '16px' }}>
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </form>

          {/* Order summary */}
          <div style={styles.summary}>
            <div style={styles.summaryTitle}>ORDER SUMMARY</div>
            {items.map(item => item.product && (
              <div key={item.product._id} style={styles.summaryItem}>
                <div style={{ flex: 1 }}>
                  <div style={styles.summaryItemName}>{item.product.name}</div>
                  <div style={styles.summaryItemQty}>Qty: {item.quantity}</div>
                </div>
                <div style={styles.summaryItemPrice}>${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
            ))}
            <div style={styles.summaryTotal}>
              <span>TOTAL</span>
              <span style={{ color: 'var(--gold)' }}>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  section: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', marginBottom: '20px' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px', marginBottom: '20px', color: 'var(--text)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)' },
  fieldNote: { fontSize: '11px', color: 'var(--text3)', fontStyle: 'italic' },
  itarSection: { background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: '6px', padding: '16px' },
  summary: { width: '300px', flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', position: 'sticky', top: '110px' },
  summaryTitle: { fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  summaryItemName: { fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' },
  summaryItemQty: { fontSize: '12px', color: 'var(--text3)' },
  summaryItemPrice: { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', flexShrink: 0 },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-mono)' },
};
