import React, { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLOR = { pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { axios.get('/api/orders/my').then(r => setOrders(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  if (!orders.length) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div style={{ fontSize: '48px', color: 'var(--border2)', marginBottom: '20px' }}>◈</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '5px', color: 'var(--text3)' }}>NO ORDERS YET</h2>
    </div>
  );

  return (
    <div className="page"><div className="container">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '6px', marginBottom: '40px' }}>MY ORDERS</h1>
      {orders.map(o => (
        <div key={o._id} style={{ border: '1px solid var(--border)', marginBottom: '8px', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px 24px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '2px', color: 'var(--text)' }}>#{o._id.slice(-8).toUpperCase()}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <span className={`badge ${STATUS_COLOR[o.status]}`}>{o.status.toUpperCase()}</span>
            <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}`}>{o.paymentStatus.toUpperCase()}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)', letterSpacing: '1px' }}>${o.totalPrice.toFixed(2)}</div>
            <span style={{ color: 'var(--text3)', fontSize: '12px' }}>{expanded === o._id ? '▲' : '▼'}</span>
          </div>
          {expanded === o._id && (
            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', paddingTop: '20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '12px' }}>ITEMS</div>
                  {o.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                      <div>
                        <div style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>{item.name}</div>
                        <div style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-ui)' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  {o.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#4caf50', fontFamily: 'var(--font-ui)' }}><span>Discount ({o.couponCode})</span><span>-${o.discount.toFixed(2)}</span></div>}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '12px' }}>SHIPPING TO</div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.9, fontStyle: 'italic' }}>
                    {o.shippingAddress.street}<br />{o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zip}<br />{o.shippingAddress.country}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div></div>
  );
}

export default Orders;
