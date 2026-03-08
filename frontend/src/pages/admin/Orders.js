import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get(`/api/admin/orders?status=${filter}&limit=50`)
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status });
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { paymentStatus });
      toast.success('Payment updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>ORDER MANAGEMENT</h1>
        <div style={styles.filters}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ ...styles.filterBtn, background: filter === s ? 'var(--gold)' : 'var(--surface)', color: filter === s ? 'var(--black)' : 'var(--text2)' }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : (
        <div style={styles.tableWrap}>
          <table className="table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>PAYMENT</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order._id}>
                  <tr onClick={() => setExpanded(expanded === order._id ? null : order._id)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{order.user?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td><span className={`badge ${STATUS_COLORS[order.status] || 'badge-gold'}`}>{order.status.toUpperCase()}</span></td>
                    <td><span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}`}>{order.paymentStatus.toUpperCase()}</span></td>
                    <td style={{ fontSize: '12px', color: 'var(--text3)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={styles.actionGroup}>
                        <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={styles.select}>
                          {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={order.paymentStatus} onChange={e => updatePayment(order._id, e.target.value)} style={styles.select}>
                          <option value="unpaid">unpaid</option>
                          <option value="paid">paid</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  {expanded === order._id && (
                    <tr>
                      <td colSpan="8" style={{ padding: '0', background: 'var(--surface2)' }}>
                        <div style={styles.expanded}>
                          <div style={{ flex: 1 }}>
                            <div style={styles.expandTitle}>ORDER ITEMS</div>
                            {order.items.map((item, i) => (
                              <div key={i} style={styles.expandItem}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.name}</div>
                                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>Qty: {item.quantity} × ${item.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ width: '220px' }}>
                            <div style={styles.expandTitle}>SHIPPING ADDRESS</div>
                            <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                              {order.shippingAddress.country}
                            </div>
                            {order.notes && <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text3)' }}>Notes: {order.notes}</div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { marginBottom: '24px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '3px', marginBottom: '16px' },
  filters: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px' },
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' },
  actionGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  select: { padding: '4px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px', color: 'var(--text)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-mono)' },
  expanded: { display: 'flex', gap: '32px', padding: '20px 24px' },
  expandTitle: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '12px' },
  expandItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' },
};
