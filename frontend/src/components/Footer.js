import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <div style={styles.logoMain}>ITAR DEFENSE SUPPLY</div>
            <p style={styles.desc}>Authorized distributor of ITAR-controlled defense and aerospace components. All transactions subject to US export regulations.</p>
          </div>
          <div>
            <div style={styles.colTitle}>SHOP</div>
            <Link to="/shop" style={styles.link}>All Products</Link>
            <Link to="/shop?category=optics" style={styles.link}>Optics</Link>
            <Link to="/shop?category=electronics" style={styles.link}>Electronics</Link>
            <Link to="/shop?category=hardware" style={styles.link}>Hardware</Link>
          </div>
          <div>
            <div style={styles.colTitle}>ACCOUNT</div>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            <Link to="/cart" style={styles.link}>Cart</Link>
          </div>
          <div>
            <div style={styles.colTitle}>COMPLIANCE</div>
            <p style={styles.compliance}>This website contains ITAR-controlled technical data. Access by foreign nationals is strictly prohibited without prior US government authorization.</p>
            <div style={styles.badges}>
              <span style={styles.badge}>ITAR COMPLIANT</span>
              <span style={styles.badge}>EAR REGULATED</span>
            </div>
          </div>
        </div>
        <div style={styles.bottom}>
          <span style={styles.copy}>© {new Date().getFullYear()} ITAR Defense Supply. All rights reserved.</span>
          <span style={styles.warning}>⚠ ITAR RESTRICTED — FOR US PERSONS ONLY</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: 'var(--dark)', borderTop: '1px solid var(--border)', marginTop: '64px', paddingTop: '48px', paddingBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '40px', marginBottom: '40px' },
  logoMain: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '12px' },
  desc: { fontSize: '13px', color: 'var(--text3)', lineHeight: 1.7 },
  colTitle: { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '12px', textTransform: 'uppercase' },
  link: { display: 'block', fontSize: '13px', color: 'var(--text2)', marginBottom: '8px', transition: 'color 0.2s' },
  compliance: { fontSize: '11px', color: 'var(--text3)', lineHeight: 1.7, marginBottom: '12px' },
  badges: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  badge: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', padding: '3px 8px', border: '1px solid var(--border2)', color: 'var(--text3)', borderRadius: '2px' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)' },
  copy: { fontSize: '12px', color: 'var(--text3)' },
  warning: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px' },
};
