import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { path: '/admin', label: 'DASHBOARD', icon: '◈' },
    { path: '/admin/products', label: 'PRODUCTS', icon: '⬡' },
    { path: '/admin/orders', label: 'ORDERS', icon: '◉' },
    { path: '/admin/users', label: 'USERS', icon: '◎' },
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>⬡</div>
          <div>
            <div style={styles.logoMain}>ITAR</div>
            <div style={styles.logoSub}>ADMIN PANEL</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ ...styles.navItem, background: active ? 'rgba(201,168,76,0.1)' : 'transparent', color: active ? 'var(--gold)' : 'var(--text2)', borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent' }}>
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.adminName}>{user?.name}</div>
            <div style={styles.adminRole}>ADMINISTRATOR</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/" style={styles.footerBtn} title="View site">🌐</Link>
            <button onClick={handleLogout} style={styles.footerBtn} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'var(--black)' },
  sidebar: { width: '220px', background: 'var(--dark)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 20px', borderBottom: '1px solid var(--border)' },
  logoIcon: { fontSize: '22px', color: 'var(--gold)' },
  logoMain: { fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '4px', color: 'var(--white)', lineHeight: 1 },
  logoSub: { fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: 'var(--text3)' },
  nav: { flex: 1, padding: '16px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1.5px', transition: 'all 0.2s', textDecoration: 'none' },
  navIcon: { fontSize: '14px' },
  sidebarFooter: { padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  adminInfo: {},
  adminName: { fontSize: '13px', fontWeight: '600', color: 'var(--text)' },
  adminRole: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: 'var(--gold)' },
  footerBtn: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)', textDecoration: 'none' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
};
