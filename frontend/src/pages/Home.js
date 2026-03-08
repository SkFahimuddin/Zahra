import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products/featured').then(r => setFeatured(r.data)).catch(() => {});
    axios.get('/api/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`);
    else navigate('/shop');
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGrid} />
        <div style={styles.heroGlow} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroEyebrow}>AUTHORIZED ITAR DISTRIBUTOR</div>
          <h1 style={styles.heroTitle}>DEFENSE &<br />AEROSPACE<br />COMPONENTS</h1>
          <p style={styles.heroDesc}>Precision-engineered parts for defense, aerospace, and government contractors. All items ITAR-controlled and export-regulated.</p>
          <form onSubmit={handleSearch} style={styles.heroSearch}>
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search by part number, manufacturer, or description..."
              style={styles.heroInput}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 4px 4px 0', padding: '12px 24px' }}>
              SEARCH
            </button>
          </form>
          <div style={styles.heroBtns}>
            <Link to="/shop" className="btn btn-primary">BROWSE ALL PRODUCTS</Link>
            <Link to="/register" className="btn btn-ghost">CREATE ACCOUNT</Link>
          </div>
        </div>
        <div style={styles.heroStats}>
          {[['1,200+', 'PRODUCTS'], ['100%', 'ITAR COMPLIANT'], ['24/7', 'SUPPORT'], ['SAME DAY', 'SHIPPING']].map(([v, l]) => (
            <div key={l} style={styles.heroStat}>
              <div style={styles.heroStatVal}>{v}</div>
              <div style={styles.heroStatLabel}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning Banner */}
      <div style={styles.warnBanner}>
        <span style={styles.warnIcon}>⚠</span>
        <span style={styles.warnText}>ITAR NOTICE: These items are controlled by the International Traffic in Arms Regulations (22 C.F.R. §§ 120-130). Export, re-export, or transfer to foreign persons requires prior authorization from the U.S. Department of State.</span>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">PRODUCT CATEGORIES</h2>
            <p className="section-sub">Browse by category</p>
            <div className="grid-4">
              {categories.map(cat => (
                <Link key={cat} to={`/shop?category=${cat}`} style={styles.catCard}>
                  <span style={styles.catIcon}>◈</span>
                  <span style={styles.catName}>{cat.toUpperCase()}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--dark)', padding: '48px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
              <div>
                <h2 className="section-title">FEATURED ITEMS</h2>
                <p className="section-sub">Hand-selected defense and aerospace equipment</p>
              </div>
              <Link to="/shop" className="btn btn-ghost btn-sm">VIEW ALL →</Link>
            </div>
            <div className="grid-products">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">WHY CHOOSE US</h2>
          <div className="grid-3" style={{ marginTop: '32px' }}>
            {[
              ['ITAR CERTIFIED', '⬡', 'All products are fully ITAR-compliant. We maintain strict records and ensure all transactions meet federal export regulations.'],
              ['GENUINE PARTS', '◈', 'Direct from manufacturers and authorized distributors. Every part comes with full traceability documentation and CoC.'],
              ['FAST FULFILLMENT', '◉', 'Same-day shipping on in-stock items. Priority handling for government and military contractors with NET 30 terms available.'],
            ].map(([title, icon, desc]) => (
              <div key={title} style={styles.featureCard}>
                <div style={styles.featureIcon}>{icon}</div>
                <div style={styles.featureTitle}>{title}</div>
                <p style={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'var(--dark)', position: 'relative', overflow: 'hidden', paddingTop: '80px', paddingBottom: '40px' },
  heroGrid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.3 },
  heroGlow: { position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  heroContent: { position: 'relative', maxWidth: '640px', paddingBottom: '48px' },
  heroEyebrow: { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '16px' },
  heroTitle: { fontFamily: 'var(--font-display)', fontSize: '80px', lineHeight: 0.95, letterSpacing: '2px', color: 'var(--white)', marginBottom: '24px' },
  heroDesc: { fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px' },
  heroSearch: { display: 'flex', marginBottom: '24px', maxWidth: '500px' },
  heroInput: { flex: 1, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '4px 0 0 4px', color: 'var(--text)', fontSize: '14px', outline: 'none' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroStats: { position: 'relative', display: 'flex', gap: '0', borderTop: '1px solid var(--border)', paddingTop: '32px' },
  heroStat: { padding: '0 32px 0 0', borderRight: '1px solid var(--border)', marginRight: '32px' },
  heroStatVal: { fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--gold)', letterSpacing: '2px' },
  heroStatLabel: { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '2px' },
  warnBanner: { background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', padding: '12px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start' },
  warnIcon: { color: 'var(--red2)', fontSize: '16px', flexShrink: 0, marginTop: '2px' },
  warnText: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text2)', lineHeight: 1.7, letterSpacing: '0.3px' },
  catCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'border-color 0.2s' },
  catIcon: { fontSize: '32px', color: 'var(--gold)' },
  catName: { fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', color: 'var(--text)' },
  featureCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '28px' },
  featureIcon: { fontSize: '32px', color: 'var(--gold)', marginBottom: '16px' },
  featureTitle: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--text)', marginBottom: '12px' },
  featureDesc: { fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 },
};
