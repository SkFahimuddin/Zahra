import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const SC = { pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get(`/api/admin/orders?status=${filter}&limit=50`).then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const update = async (id, data) => {
    await axios.put(`/api/admin/orders/${id}`, data); toast.success('Updated'); load();
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '5px', color: 'var(--gold)' }}>MANAGE</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', marginTop: '4px' }}>ORDERS</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {STATUSES.map(s => <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 16px', background: filter === s ? 'var(--gold)' : 'var(--surface)', border: '1px solid var(--border)', color: filter === s ? 'var(--black)' : 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px' }}>{s.toUpperCase()}</button>)}
        </div>
      </div>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div> : (
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th><th>PAYMENT</th><th>DATE</th><th>UPDATE</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <React.Fragment key={o._id}>
                  <tr onClick={() => setExpanded(expanded === o._id ? null : o._id)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td><div style={{ fontSize: '13px' }}>{o.user?.name}</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>{o.user?.email}</div></td>
                    <td style={{ color: 'var(--text3)' }}>{o.items.length}</td>
                    <td style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '1px' }}>${o.totalPrice.toFixed(2)}</td>
                    <td><span className={`badge ${SC[o.status]}`}>{o.status.toUpperCase()}</span></td>
                    <td><span className={`badge ${o.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}`}>{o.paymentStatus.toUpperCase()}</span></td>
                    <td style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <select value={o.status} onChange={e => update(o._id, { status: e.target.value })} style={{ padding: '4px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-display)', cursor: 'pointer' }}>
                          {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={o.paymentStatus} onChange={e => update(o._id, { paymentStatus: e.target.value })} style={{ padding: '4px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '11px', fontFamily: 'var(--font-ui)', cursor: 'pointer' }}>
                          <option value="unpaid">unpaid</option><option value="paid">paid</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr><td colSpan="8" style={{ background: 'var(--surface2)', padding: '0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', padding: '20px 24px' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '12px' }}>ITEMS</div>
                          {o.items.map((item, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}><span>{item.name} × {item.quantity}</span><span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>${(item.price * item.quantity).toFixed(2)}</span></div>)}
                          {o.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px', color: '#4caf50' }}><span>Coupon ({o.couponCode})</span><span>-${o.discount.toFixed(2)}</span></div>}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '12px' }}>SHIPPING TO</div>
                          <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.9, fontStyle: 'italic' }}>{o.shippingAddress.street}<br />{o.shippingAddress.city}, {o.shippingAddress.state}<br />{o.shippingAddress.country}</div>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {!orders.length && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontStyle: 'italic' }}>No orders found.</div>}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
