import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STATUS_COLOR = { pending: 'badge-gold', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get('/api/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>;
  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '5px', color: 'var(--gold)' }}>OVERVIEW</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '5px', marginTop: '6px' }}>DASHBOARD</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', marginBottom: '32px' }}>
        {[
          ['REVENUE', `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`, '◈', '/admin/orders'],
          ['ORDERS', stats?.totalOrders || 0, '◉', '/admin/orders'],
          ['PRODUCTS', stats?.totalProducts || 0, '✦', '/admin/products'],
          ['CUSTOMERS', stats?.totalUsers || 0, '◎', '/admin/users'],
        ].map(([label, val, icon, link]) => (
          <Link key={label} to={link} style={{ background: 'var(--surface)', padding: '28px 24px', display: 'block', textDecoration: 'none' }}>
            <div style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '12px', opacity: 0.7 }}>{icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--cream)', letterSpacing: '2px', marginBottom: '4px' }}>{val}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '4px', color: 'var(--text3)' }}>{label}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, border: '1px solid var(--border)', padding: '24px', background: 'var(--surface)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '20px' }}>RECENT ORDERS</div>
          <table className="table">
            <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>AMOUNT</th><th>STATUS</th></tr></thead>
            <tbody>
              {(stats?.recentOrders || []).map(o => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px' }}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td><div style={{ fontSize: '13px' }}>{o.user?.name}</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>{o.user?.email}</div></td>
                  <td style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '1px' }}>${o.totalPrice.toFixed(2)}</td>
                  <td><span className={`badge ${STATUS_COLOR[o.status]}`}>{o.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ width: '220px' }}>
          <div style={{ border: '1px solid var(--border)', padding: '24px', background: 'var(--surface)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '16px' }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/admin/products" className="btn btn-gold btn-sm" style={{ justifyContent: 'center' }}>+ ADD PRODUCT</Link>
              <Link to="/admin/coupons" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>+ ADD COUPON</Link>
              <Link to="/shop" className="btn btn-dark btn-sm" style={{ justifyContent: 'center' }}>VIEW STORE ↗</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
