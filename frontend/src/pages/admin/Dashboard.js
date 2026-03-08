import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STATUS_COLORS = { pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>COMMAND CENTER</h1>
        <div style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: 'TOTAL PRODUCTS', value: stats?.totalProducts || 0, icon: '⬡', link: '/admin/products', color: 'var(--gold)' },
          { label: 'TOTAL ORDERS', value: stats?.totalOrders || 0, icon: '◉', link: '/admin/orders', color: '#3498db' },
          { label: 'REGISTERED USERS', value: stats?.totalUsers || 0, icon: '◎', link: '/admin/users', color: 'var(--green)' },
          { label: 'TOTAL REVENUE', value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '◈', color: '#9b59b6' },
        ].map(s => (
          <Link key={s.label} to={s.link || '#'} style={{ ...styles.statCard, textDecoration: 'none' }}>
            <div style={{ ...styles.statIcon, color: s.color }}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>QUICK ACTIONS</div>
        <div style={styles.actions}>
          <Link to="/admin/products" className="btn btn-primary">+ ADD PRODUCT</Link>
          <Link to="/admin/orders" className="btn btn-ghost">VIEW ALL ORDERS</Link>
          <Link to="/shop" className="btn btn-ghost" target="_blank">VIEW STOREFRONT ↗</Link>
        </div>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>RECENT ORDERS</div>
          <table className="table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{order.user?.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td><span className={`badge ${STATUS_COLORS[order.status] || 'badge-gold'}`}>{order.status.toUpperCase()}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text3)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '3px' },
  date: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', display: 'block' },
  statIcon: { fontSize: '28px', marginBottom: '12px' },
  statValue: { fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '2px', marginBottom: '4px', color: 'var(--text)' },
  statLabel: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)' },
  section: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', marginBottom: '20px' },
  sectionTitle: { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '16px' },
  actions: { display: 'flex', gap: '12px' },
};
