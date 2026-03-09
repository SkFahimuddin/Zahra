import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SORTS = [['newest', 'Newest'], ['price_asc', 'Price: Low→High'], ['price_desc', 'Price: High→Low'], ['rating', 'Top Rated']];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    axios.get('/api/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category !== 'all') p.set('category', category);
    p.set('page', page); p.set('limit', 12); p.set('sort', sort);
    axios.get(`/api/products?${p}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [search, category, page, sort]);

  const set = (key, val) => { const p = new URLSearchParams(searchParams); p.set(key, val); p.delete('page'); setSearchParams(p); };

  return (
    <div className="page">
      <div className="container">
        <div style={s.header}>
          <div>
            <span className="section-label">THE COLLECTION</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>
              {search ? `RESULTS FOR "${search.toUpperCase()}"` : category !== 'all' ? category.toUpperCase() : 'ALL FRAGRANCES'}
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: '14px', marginTop: '8px', fontStyle: 'italic' }}>{total} fragrances</p>
          </div>
          <select value={sort} onChange={e => set('sort', e.target.value)} className="input" style={{ width: '200px' }}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div style={s.layout}>
          <aside style={s.sidebar}>
            <div style={s.filterBlock}>
              <div style={s.filterTitle}>COLLECTIONS</div>
              {['all', ...categories].map(cat => (
                <button key={cat} onClick={() => set('category', cat)} style={{ ...s.filterBtn, color: category === cat ? 'var(--gold)' : 'var(--text3)', background: category === cat ? 'rgba(201,168,76,0.07)' : 'transparent', borderLeft: `2px solid ${category === cat ? 'var(--gold)' : 'transparent'}` }}>
                  {cat === 'all' ? 'All Fragrances' : cat}
                </button>
              ))}
            </div>
          </aside>
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '48px', color: 'var(--border2)', marginBottom: '16px' }}>✦</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '4px', color: 'var(--text3)' }}>NO FRAGRANCES FOUND</h3>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div style={s.pagination}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => set('page', p)} style={{ ...s.pageBtn, background: page === p ? 'var(--gold)' : 'transparent', color: page === p ? 'var(--black)' : 'var(--text3)', borderColor: page === p ? 'var(--gold)' : 'var(--border)' }}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' },
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  sidebar: { width: '200px', flexShrink: 0, position: 'sticky', top: '130px' },
  filterBlock: { borderTop: '1px solid var(--border)' },
  filterTitle: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', padding: '16px 0 12px', marginBottom: '4px' },
  filterBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-body)', fontStyle: 'italic', transition: 'all 0.2s', marginBottom: '2px' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' },
  pageBtn: { width: '38px', height: '38px', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px', transition: 'all 0.2s' },
};
