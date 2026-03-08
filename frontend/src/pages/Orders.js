import React, { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue',
  delivered: 'badge-green', cancelled: 'badge-red'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  if (orders.length === 0) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>◈</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '3px', color: 'var(--text2)', marginBottom: '8px' }}>NO ORDERS YET</h2>
      <p style={{ color: 'var(--text3)' }}>Your order history will appear here</p>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '32px' }}>MY ORDERS</h1>
        {orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div style={styles.orderMeta}>
                <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div style={styles.orderStatus}>
                <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gold'}`}>{order.status.toUpperCase()}</span>
                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}`}>{order.paymentStatus.toUpperCase()}</span>
              </div>
              <div style={styles.orderTotal}>${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <span style={styles.expandIcon}>{expanded === order._id ? '▲' : '▼'}</span>
            </div>

            {expanded === order._id && (
              <div style={styles.orderBody}>
                <div style={styles.itemsSection}>
                  <div style={styles.bodyTitle}>ITEMS</div>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.orderItem}>
                      {item.image && <img src={`http://localhost:5000${item.image}`} alt={item.name} style={styles.itemImg} />}
                      <div style={{ flex: 1 }}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={styles.itemQty}>Qty: {item.quantity}</div>
                      </div>
                      <div style={styles.itemPrice}>${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                  ))}
                </div>
                <div style={styles.shippingSection}>
                  <div style={styles.bodyTitle}>SHIPPING ADDRESS</div>
                  <div style={styles.address}>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                  {order.notes && <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text3)' }}>Notes: {order.notes}</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  orderCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '12px', overflow: 'hidden' },
  orderHeader: { display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 20px', cursor: 'pointer' },
  orderMeta: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  orderId: { fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: '700', color: 'var(--text)' },
  orderDate: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' },
  orderStatus: { display: 'flex', gap: '8px' },
  orderTotal: { fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: 'var(--gold)' },
  expandIcon: { color: 'var(--text3)', fontSize: '12px' },
  orderBody: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderTop: '1px solid var(--border)' },
  itemsSection: { padding: '20px', borderRight: '1px solid var(--border)' },
  shippingSection: { padding: '20px' },
  bodyTitle: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '12px' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  itemImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px', background: 'var(--surface2)' },
  itemName: { fontSize: '13px', fontWeight: '500', color: 'var(--text)' },
  itemQty: { fontSize: '12px', color: 'var(--text3)' },
  itemPrice: { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)' },
  address: { fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8 },
};
