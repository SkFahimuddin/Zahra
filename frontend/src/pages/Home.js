import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products/featured').then(r => setFeatured(r.data)).catch(() => {});
  }, []);

  const categories = [
    { name: 'Attar', label: 'Pure Attar', desc: 'Alcohol-free concentrates', icon: '◈' },
    { name: 'Oud & Bakhoor', label: 'Oud & Bakhoor', desc: 'Rare wood & incense', icon: '✦' },
    { name: 'Gift Sets', label: 'Gift Sets', desc: 'Curated collections', icon: '◉' },
    { name: 'Accessories', label: 'Accessories', desc: 'Crystals & holders', icon: '◎' },
  ];

  return (
    <div>
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroGlow} />
        <div className="container" style={s.heroContent}>
          <div style={s.heroLeft}>
            <div style={s.heroEye}>✦ THE ART OF ARABIAN FRAGRANCE ✦</div>
            <h1 style={s.heroTitle}>
              <span style={s.heroTitleLine1}>SCENTS</span>
              <span style={s.heroTitleLine2}><em>of the</em></span>
              <span style={s.heroTitleLine3}>ORIENT</span>
            </h1>
            <p style={s.heroDesc}>Each fragrance in our collection is an heirloom of the Arabian peninsula — distilled from rare flowers, ancient woods, and sacred resins by master perfumers.</p>
            <div style={s.heroBtns}>
              <Link to="/shop" className="btn btn-gold">EXPLORE COLLECTION</Link>
              <Link to="/shop?category=Gift+Sets" className="btn btn-outline">GIFT SETS</Link>
            </div>
          </div>
          <div style={s.heroRight}>
            <div style={s.heroCard}>
              <div style={s.heroCardInner}>
                <div style={s.heroCardOrnament}>✦</div>
                <div style={s.heroCardTitle}>SIGNATURE</div>
                <div style={s.heroCardName}>Oud Al Layl</div>
                <div style={s.heroCardDesc}>The Night Oud — an elixir of dark woods and precious amber</div>
                <button onClick={() => navigate('/shop')} className="btn btn-outline btn-sm" style={{ marginTop: '20px' }}>DISCOVER</button>
              </div>
              <div style={s.heroCardGlow} />
            </div>
          </div>
        </div>
        <div style={s.heroStats}>
          <div className="container">
            <div style={s.statsRow}>
              {[['500+', 'Fragrances'], ['20+', 'Years Heritage'], ['50+', 'Countries'], ['100%', 'Authentic']].map(([v, l]) => (
                <div key={l} style={s.stat}>
                  <div style={s.statVal}>{v}</div>
                  <div style={s.statLabel}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">OUR COLLECTIONS</span>
            <h2 className="section-title">THE TREASURY</h2>
            <p className="section-sub">From the souks of Arabia to your doorstep</p>
          </div>
          <div style={s.catGrid}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} style={s.catCard}>
                <div style={s.catIcon}>{cat.icon}</div>
                <div style={s.catName}>{cat.label}</div>
                <div style={s.catDesc}>{cat.desc}</div>
                <div style={s.catArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section style={{ background: 'var(--surface)', padding: '72px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
              <div>
                <span className="section-label">HAND SELECTED</span>
                <h2 className="section-title">FEATURED FRAGRANCES</h2>
              </div>
              <Link to="/shop" className="btn btn-outline btn-sm">VIEW ALL</Link>
            </div>
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div style={s.story}>
            <div style={s.storyLeft}>
              <div style={s.storyOrnament}>✦ ✦ ✦</div>
              <span className="section-label">OUR HERITAGE</span>
              <h2 className="section-title" style={{ fontSize: '38px' }}>THE ITAR STORY</h2>
              <p style={s.storyText}>Born from a deep reverence for the ancient perfuming traditions of Arabia, ITAR was founded to bring the world's most precious scents to those who appreciate the extraordinary. Our master perfumers source only the rarest raw materials — Assam oud, Taif roses, Kashmir musk — to create fragrances that are not merely worn, but experienced.</p>
              <Link to="/shop" className="btn btn-outline" style={{ marginTop: '24px' }}>EXPLORE OUR STORY</Link>
            </div>
            <div style={s.storyRight}>
              <div style={s.storyQuote}>
                <div style={s.quoteOrnament}>"</div>
                <p style={s.quoteText}>A great perfume is a biography of the soul — each note a memory, each hour a chapter.</p>
                <div style={s.quoteAuthor}>— Founder, ITAR Perfumes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container">
          <div style={s.promiseGrid}>
            {[
              ['✦', 'PURE & AUTHENTIC', 'Zero alcohol, zero synthetics. Only the finest natural ingredients, faithfully sourced.'],
              ['◈', 'MASTER CRAFTED', 'Each bottle is the work of perfumers with decades of artisanal expertise.'],
              ['◉', 'LONG LASTING', 'Our concentrates last 12–24 hours on skin. A single dab is all you need.'],
              ['◎', 'SECURE DELIVERY', 'Luxury packaging. Worldwide express shipping. Every order, perfect.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={s.promise}>
                <div style={s.promiseIcon}>{icon}</div>
                <div style={s.promiseTitle}>{title}</div>
                <p style={s.promiseDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  hero: { position: 'relative', background: 'var(--dark)', minHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.03) 0%, transparent 40%)', pointerEvents: 'none' },
  heroGlow: { position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.04) 100%)', pointerEvents: 'none' },
  heroContent: { display: 'flex', alignItems: 'center', gap: '64px', flex: 1, padding: '80px 32px 40px' },
  heroLeft: { flex: 1 },
  heroEye: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '5px', color: 'var(--gold)', marginBottom: '24px', opacity: 0.8 },
  heroTitle: { display: 'flex', flexDirection: 'column', marginBottom: '28px' },
  heroTitleLine1: { fontFamily: 'var(--font-display)', fontSize: '96px', letterSpacing: '16px', color: 'var(--cream)', lineHeight: 0.9 },
  heroTitleLine2: { fontFamily: 'var(--font-body)', fontSize: '32px', color: 'var(--text2)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5, paddingLeft: '8px' },
  heroTitleLine3: { fontFamily: 'var(--font-display)', fontSize: '96px', letterSpacing: '16px', color: 'var(--gold)', lineHeight: 0.9 },
  heroDesc: { fontSize: '16px', color: 'var(--text2)', lineHeight: 1.9, marginBottom: '36px', maxWidth: '460px', fontStyle: 'italic' },
  heroBtns: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  heroRight: { flex: '0 0 380px' },
  heroCard: { position: 'relative', border: '1px solid var(--border2)', padding: '2px' },
  heroCardInner: { background: 'var(--surface)', padding: '48px 40px', textAlign: 'center', position: 'relative' },
  heroCardOrnament: { color: 'var(--gold)', fontSize: '20px', marginBottom: '20px', letterSpacing: '8px', display: 'block' },
  heroCardTitle: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '5px', color: 'var(--text3)', marginBottom: '12px' },
  heroCardName: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '3px', color: 'var(--cream)', marginBottom: '12px' },
  heroCardDesc: { fontSize: '14px', color: 'var(--text2)', fontStyle: 'italic', lineHeight: 1.7 },
  heroCardGlow: { position: 'absolute', inset: -1, background: 'linear-gradient(135deg, var(--gold), transparent, var(--gold))', opacity: 0.15, pointerEvents: 'none' },
  heroStats: { background: 'rgba(201,168,76,0.05)', borderTop: '1px solid var(--border)' },
  statsRow: { display: 'flex', justifyContent: 'center' },
  stat: { padding: '24px 48px', textAlign: 'center', borderRight: '1px solid var(--border)' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--gold)', letterSpacing: '2px' },
  statLabel: { fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px', color: 'var(--text3)', marginTop: '4px' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' },
  catCard: { background: 'var(--black)', padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'background 0.3s', position: 'relative', overflow: 'hidden' },
  catIcon: { fontSize: '28px', color: 'var(--gold)', marginBottom: '8px', opacity: 0.7 },
  catName: { fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '3px', color: 'var(--cream)' },
  catDesc: { fontSize: '13px', color: 'var(--text3)', fontStyle: 'italic' },
  catArrow: { color: 'var(--gold)', fontSize: '18px', marginTop: '8px', opacity: 0.5 },
  story: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' },
  storyLeft: {},
  storyOrnament: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '8px', color: 'var(--gold)', opacity: 0.4, marginBottom: '16px', display: 'block' },
  storyText: { fontSize: '16px', color: 'var(--text2)', lineHeight: 2, fontStyle: 'italic' },
  storyRight: {},
  storyQuote: { border: '1px solid var(--border2)', padding: '48px 40px', position: 'relative' },
  quoteOrnament: { fontFamily: 'var(--font-body)', fontSize: '120px', color: 'var(--gold)', opacity: 0.1, position: 'absolute', top: '-20px', left: '16px', lineHeight: 1 },
  quoteText: { fontFamily: 'var(--font-body)', fontSize: '22px', color: 'var(--cream)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '20px', position: 'relative' },
  quoteAuthor: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--gold)' },
  promiseGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' },
  promise: { textAlign: 'center' },
  promiseIcon: { fontSize: '28px', color: 'var(--gold)', marginBottom: '16px', opacity: 0.7 },
  promiseTitle: { fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '3px', color: 'var(--cream)', marginBottom: '10px' },
  promiseDesc: { fontSize: '13px', color: 'var(--text3)', lineHeight: 1.8, fontStyle: 'italic' },
};
