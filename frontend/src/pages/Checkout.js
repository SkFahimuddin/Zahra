import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', state: '', zip: '', country: 'Saudi Arabia', notes: '' });

  const items = cart.items || [];
  const discount = couponApplied?.discount || 0;
  const finalTotal = cartTotal - discount;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await axios.post('/api/coupons/validate', { code: couponCode, orderTotal: cartTotal });
      setCouponApplied(data);
      toast.success(`Coupon applied! You save $${data.discount.toFixed(2)}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon');
      setCouponApplied(null);
    } finally { setCouponLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      await axios.post('/api/orders', {
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: form,
        couponCode: couponApplied ? couponCode : null,
        notes: form.notes
      });
      await fetchCart();
      toast.success('✦ Order placed successfully!');
      navigate('/orders');
    } catch (e) { toast.error(e.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '6px', marginBottom: '48px' }}>CHECKOUT</h1>
        <div style={s.layout}>
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <div style={s.block}>
              <div style={s.blockTitle}>SHIPPING DETAILS</div>
              <div style={s.grid2}>
                {[['street', 'STREET ADDRESS', 'text', true, '123 Al Olaya, Riyadh'],
                  ['city', 'CITY', 'text', true, 'Riyadh'],
                  ['state', 'STATE / PROVINCE', 'text', false, 'Riyadh'],
                  ['zip', 'POSTAL CODE', 'text', false, '11564']].map(([name, label, type, req, ph]) => (
                  <div key={name} style={s.field}>
                    <label style={s.label}>{label}</label>
                    <input name={name} type={type} value={form[name]} onChange={handleChange} required={req} placeholder={ph} className="input" />
                  </div>
                ))}
                <div style={{ ...s.field, gridColumn: '1/-1' }}>
                  <label style={s.label}>COUNTRY</label>
                  <select name="country" value={form.country} onChange={handleChange} className="input">
                    {['Saudi Arabia','UAE','Kuwait','Qatar','Bahrain','Oman','Jordan','Egypt','Pakistan','India','United Kingdom','United States','Canada','Australia'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ ...s.field, gridColumn: '1/-1' }}>
                  <label style={s.label}>SPECIAL INSTRUCTIONS</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className="input" rows="2" placeholder="Gift message, special requests..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={s.block}>
              <div style={s.blockTitle}>PROMO CODE</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="input" style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-display)' }} />
                <button type="button" onClick={applyCoupon} disabled={couponLoading} className="btn btn-outline">{couponLoading ? '...' : 'APPLY'}</button>
              </div>
              {couponApplied && (
                <div style={s.couponSuccess}>✦ Code applied — you save <strong style={{ color: 'var(--gold)' }}>${couponApplied.discount.toFixed(2)}</strong></div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', padding: '16px', letterSpacing: '4px', fontSize: '14px' }}>
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </form>

          <div style={s.summary}>
            <div style={s.sumTitle}>ORDER SUMMARY</div>
            {items.map(item => item.product && (
              <div key={item.product._id} style={s.sumItem}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '1px', color: 'var(--cream)' }}>{item.product.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>Qty: {item.quantity} · {item.product.volume}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--gold)' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div style={s.sumRows}>
              <div style={s.sumRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              {discount > 0 && <div style={{ ...s.sumRow, color: 'var(--green)' }}><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
              <div style={s.sumRow}><span>Shipping</span><span style={{ color: cartTotal >= 199 ? 'var(--green)' : undefined }}>{cartTotal >= 199 ? 'FREE' : 'TBD'}</span></div>
            </div>
            <div style={s.sumTotal}><span>TOTAL</span><span style={{ color: 'var(--gold)' }}>${finalTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  block: { border: '1px solid var(--border)', padding: '28px', marginBottom: '20px', background: 'var(--surface)' },
  blockTitle: { fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '20px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)' },
  couponSuccess: { marginTop: '12px', fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' },
  summary: { width: '300px', flexShrink: 0, border: '1px solid var(--border)', padding: '24px', background: 'var(--surface)', position: 'sticky', top: '130px' },
  sumTitle: { fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' },
  sumItem: { display: 'flex', gap: '12px', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  sumRows: { paddingTop: '16px' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text2)', marginBottom: '8px', fontFamily: 'var(--font-ui)' },
  sumTotal: { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '2px', padding: '16px 0', marginTop: '8px', borderTop: '1px solid var(--border)' },
};
