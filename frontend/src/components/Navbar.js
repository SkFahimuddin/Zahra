import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <div>
            <div style={styles.logoMain}>ITAR</div>
            <div style={styles.logoSub}>DEFENSE SUPPLY</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search parts, equipment..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>
            <SearchIcon />
          </button>
        </form>

        {/* Nav links */}
        <div style={styles.navLinks}>
          <NavLink to="/shop" active={location.pathname === '/shop'}>SHOP</NavLink>
          {user ? (
            <>
              <NavLink to="/orders" active={location.pathname === '/orders'}>ORDERS</NavLink>
              <Link to="/cart" style={{ ...styles.cartBtn, position: 'relative' }}>
                <CartIcon />
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </Link>
              <div style={styles.userMenu}>
                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">LOGOUT</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">LOGIN</Link>
              <Link to="/register" className="btn btn-primary btn-sm">SIGN UP</Link>
            </>
          )}
        </div>
      </div>

      {/* Ticker */}
      <div style={styles.ticker}>
        <div style={styles.tickerInner}>
          {['ITAR CONTROLLED ITEMS', 'US PERSONS ONLY', 'EXPORT RESTRICTED', 'AUTHORIZED DEALERS', 'CERTIFIED SUPPLIERS'].map((t, i) => (
            <span key={i} style={styles.tickerItem}>◆ {t}</span>
          ))}
          {['ITAR CONTROLLED ITEMS', 'US PERSONS ONLY', 'EXPORT RESTRICTED', 'AUTHORIZED DEALERS', 'CERTIFIED SUPPLIERS'].map((t, i) => (
            <span key={`r${i}`} style={styles.tickerItem}>◆ {t}</span>
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', color: active ? 'var(--gold)' : 'var(--text2)', padding: '4px 0', borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent', transition: 'all 0.2s' }}>
      {children}
    </Link>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function CartIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}

const styles = {
  nav: { background: 'var(--dark)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  inner: { display: 'flex', alignItems: 'center', gap: '24px', height: '64px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  logoIcon: { fontSize: '24px', color: 'var(--gold)' },
  logoMain: { fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '4px', color: 'var(--white)', lineHeight: 1 },
  logoSub: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)' },
  searchForm: { flex: 1, display: 'flex', maxWidth: '420px' },
  searchInput: { flex: 1, padding: '8px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '4px 0 0 4px', color: 'var(--text)', fontSize: '13px', outline: 'none' },
  searchBtn: { padding: '8px 14px', background: 'var(--gold)', border: 'none', borderRadius: '0 4px 4px 0', color: 'var(--black)', cursor: 'pointer' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto', flexShrink: 0 },
  cartBtn: { color: 'var(--text2)', display: 'flex', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: '-6px', right: '-8px', background: 'var(--gold)', color: 'var(--black)', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' },
  userMenu: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)' },
  ticker: { background: 'var(--surface)', borderTop: '1px solid var(--border)', height: '28px', overflow: 'hidden' },
  tickerInner: { display: 'flex', gap: '40px', animation: 'ticker 25s linear infinite', whiteSpace: 'nowrap', paddingTop: '5px' },
  tickerItem: { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px' },
};

// Add ticker animation
const style = document.createElement('style');
style.textContent = `@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`;
document.head.appendChild(style);
