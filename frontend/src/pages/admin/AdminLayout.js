import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { path: '/admin', label: 'DASHBOARD', icon: '◈' },
  { path: '/admin/products', label: 'PRODUCTS', icon: '✦' },
  { path: '/admin/orders', label: 'ORDERS', icon: '◉' },
  { path: '/admin/users', label: 'CUSTOMERS', icon: '◎' },
  { path: '/admin/coupons', label: 'COUPONS', icon: '⬡' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandOrnament}>✦</div>
          <div style={s.brandName}>ITAR</div>
          <div style={s.brandSub}>ADMIN</div>
        </div>
        <nav style={s.nav}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ ...s.navItem, color: active ? 'var(--gold)' : 'var(--text3)', background: active ? 'rgba(201,168,76,0.07)' : 'transparent', borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}` }}>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={s.footer}>
          <div style={s.adminName}>{user?.name}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/" style={s.footerBtn} title="View store">↗</Link>
            <button onClick={() => { logout(); navigate('/login'); }} style={s.footerBtn} title="Logout">⏻</button>
          </div>
        </div>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  sidebar: { width: '220px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  brand: { padding: '32px 24px 24px', borderBottom: '1px solid var(--border)', textAlign: 'center' },
  brandOrnament: { color: 'var(--gold)', fontSize: '12px', letterSpacing: '6px', marginBottom: '6px', opacity: 0.6 },
  brandName: { fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '8px', color: 'var(--cream)', lineHeight: 1 },
  brandSub: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '5px', color: 'var(--text3)', marginTop: '4px' },
  nav: { flex: 1, padding: '16px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '3px', transition: 'all 0.2s', textDecoration: 'none' },
  footer: { padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  adminName: { fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)', fontStyle: 'italic' },
  footerBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '13px', color: 'var(--text2)', textDecoration: 'none' },
  main: { flex: 1, padding: '40px', overflow: 'auto' },
};
