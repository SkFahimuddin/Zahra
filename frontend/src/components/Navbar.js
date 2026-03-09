import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`);
    setShowSearch(false); setSearchQ('');
  };

  return (
    <>
      <div style={styles.topBar}>
        <span style={styles.topText}>✦ Free shipping on orders over $199 ✦ Authentic Arabian fragrances ✦ Worldwide delivery ✦</span>
      </div>

      <nav style={{ ...styles.nav, background: scrolled ? 'rgba(8,7,6,0.97)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
        <div className="container" style={styles.inner}>
          <div style={styles.navLeft}>
            <NavLink to="/shop" label="SHOP" />
            <NavLink to="/shop?category=Attar" label="ATTAR" />
            <NavLink to="/shop?category=Oud+%26+Bakhoor" label="OUD" />
          </div>

          <Link to="/" style={styles.logo}>
            <div style={styles.logoOrnament}>✦</div>
            <div style={styles.logoText}>ITAR</div>
            <div style={styles.logoSub}>ARABIAN PERFUMES</div>
          </Link>

          <div style={styles.navRight}>
            <NavLink to="/shop?category=Gift+Sets" label="GIFTS" />
            <button onClick={() => setShowSearch(!showSearch)} style={styles.iconBtn} title="Search">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            {user ? (
              <>
                <Link to="/wishlist" style={styles.iconBtn} title="Wishlist">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </Link>
                <Link to="/cart" style={{ ...styles.iconBtn, position: 'relative' }} title="Cart">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                </Link>
                <div style={{ position: 'relative' }} className="user-menu-wrap">
                  <button style={styles.userBtn} title={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <div style={styles.dropdown}>
                    <Link to="/orders" style={styles.dropItem}>My Orders</Link>
                    <Link to="/wishlist" style={styles.dropItem}>Wishlist</Link>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ ...styles.dropItem, background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.iconBtn} title="Login">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>
                <Link to="/register" className="btn btn-outline btn-sm">JOIN</Link>
              </>
            )}
          </div>
        </div>

        {showSearch && (
          <div style={styles.searchBar}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search fragrances, oud, attar..." autoFocus style={styles.searchInput} />
              <button type="submit" className="btn btn-gold btn-sm">SEARCH</button>
            </form>
          </div>
        )}
      </nav>

      <style>{`
        .user-menu-wrap:hover > div:last-child { display: flex !important; }
      `}</style>
    </>
  );
}

function NavLink({ to, label }) {
  const location = useLocation();
  const active = location.pathname + location.search === to || location.pathname === to.split('?')[0];
  return (
    <Link to={to} style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '3px', color: active ? 'var(--gold)' : 'var(--text2)', padding: '4px 0', borderBottom: `1px solid ${active ? 'var(--gold)' : 'transparent'}`, transition: 'all 0.2s' }}>
      {label}
    </Link>
  );
}

const styles = {
  topBar: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '7px', textAlign: 'center', overflow: 'hidden' },
  topText: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--gold)', whiteSpace: 'nowrap' },
  nav: { position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '24px' },
  navLeft: { display: 'flex', gap: '32px', alignItems: 'center', flex: 1 },
  navRight: { display: 'flex', gap: '20px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  logo: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: '2px' },
  logoOrnament: { color: 'var(--gold)', fontSize: '12px', letterSpacing: '4px' },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '10px', color: 'var(--cream)', lineHeight: 1, paddingLeft: '10px' },
  logoSub: { fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '5px', color: 'var(--text3)', paddingLeft: '5px' },
  iconBtn: { background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.2s' },
  cartBadge: { position: 'absolute', top: '-4px', right: '-6px', background: 'var(--gold)', color: 'var(--black)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', fontFamily: 'var(--font-ui)' },
  userBtn: { background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--gold)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', cursor: 'pointer' },
  dropdown: { display: 'none', position: 'absolute', top: '40px', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', minWidth: '160px', zIndex: 200, flexDirection: 'column' },
  dropItem: { display: 'block', padding: '12px 16px', fontSize: '13px', color: 'var(--text2)', borderBottom: '1px solid var(--border)', transition: 'color 0.2s', fontFamily: 'var(--font-ui)' },
  searchBar: { background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px 0' },
  searchForm: { display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' },
  searchInput: { flex: 1, padding: '10px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' },
};
