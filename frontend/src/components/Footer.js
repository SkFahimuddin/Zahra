import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div className="container">
        <div style={s.top}>
          <div style={s.brand}>
            <div style={s.ornament}>✦</div>
            <div style={s.logoText}>ITAR</div>
            <div style={s.logoSub}>ARABIAN PERFUMES</div>
            <p style={s.desc}>Purveyors of the finest Arabian fragrances. Each scent is a journey through the ancient spice routes of the Orient.</p>
          </div>
          <div>
            <div style={s.colTitle}>COLLECTIONS</div>
            {['Attar', 'Oud & Bakhoor', 'Gift Sets', 'Accessories'].map(c => (
              <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} style={s.link}>{c}</Link>
            ))}
          </div>
          <div>
            <div style={s.colTitle}>ACCOUNT</div>
            {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Wishlist', '/wishlist']].map(([l, h]) => (
              <Link key={l} to={h} style={s.link}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={s.colTitle}>NEWSLETTER</div>
            <p style={s.nlDesc}>Subscribe for exclusive offers and new arrivals.</p>
            <div style={s.nlForm}>
              <input placeholder="Your email" style={s.nlInput} />
              <button className="btn btn-gold btn-sm">JOIN</button>
            </div>
          </div>
        </div>
        <div style={s.divider}>
          <span style={{ color: 'var(--gold)', fontSize: '18px' }}>✦ ✦ ✦</span>
        </div>
        <div style={s.bottom}>
          <span style={s.copy}>© {new Date().getFullYear()} ITAR Arabian Perfumes. All rights reserved.</span>
          <div style={s.socials}>
            {['Instagram', 'Facebook', 'WhatsApp'].map(s2 => (
              <span key={s2} style={s.socialLink}>{s2}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const s = {
  footer: { background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: '80px', padding: '64px 0 24px' },
  top: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '48px', marginBottom: '48px' },
  brand: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' },
  ornament: { color: 'var(--gold)', fontSize: '14px', letterSpacing: '4px' },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '8px', color: 'var(--cream)' },
  logoSub: { fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '4px', color: 'var(--text3)', marginBottom: '16px' },
  desc: { fontSize: '14px', color: 'var(--text3)', lineHeight: 1.8, fontStyle: 'italic' },
  colTitle: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '16px' },
  link: { display: 'block', fontSize: '14px', color: 'var(--text3)', marginBottom: '10px', fontStyle: 'italic', transition: 'color 0.2s' },
  nlDesc: { fontSize: '13px', color: 'var(--text3)', marginBottom: '16px', fontStyle: 'italic' },
  nlForm: { display: 'flex', gap: '0' },
  nlInput: { flex: 1, padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-ui)' },
  divider: { textAlign: 'center', marginBottom: '24px', letterSpacing: '12px', opacity: 0.4 },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  copy: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' },
  socials: { display: 'flex', gap: '20px' },
  socialLink: { cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: '2px', fontSize: '10px', color: 'var(--text3)' },
};
