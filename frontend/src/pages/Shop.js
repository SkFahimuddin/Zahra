import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

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

  useEffect(() => {
    axios.get('/api/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    params.set('page', page);
    params.set('limit', 12);
    axios.get(`/api/products?${params}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, val);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 className="section-title">ALL PRODUCTS</h1>
            <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{total} items found{search ? ` for "${search}"` : ''}</p>
          </div>
        </div>

        <div style={styles.layout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.filterSection}>
              <div style={styles.filterTitle}>CATEGORIES</div>
              {['all', ...categories].map(cat => (
                <button key={cat} onClick={() => setFilter('category', cat)}
                  style={{ ...styles.filterBtn, color: category === cat ? 'var(--gold)' : 'var(--text2)', background: category === cat ? 'rgba(201,168,76,0.1)' : 'transparent' }}>
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>⬡</div>
                <div style={styles.emptyText}>NO PRODUCTS FOUND</div>
                <p style={{ color: 'var(--text3)', fontSize: '13px' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid-products">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div style={styles.pagination}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setFilter('page', p)}
                        style={{ ...styles.pageBtn, background: page === p ? 'var(--gold)' : 'transparent', color: page === p ? 'var(--black)' : 'var(--text2)' }}>
                        {p}
                      </button>
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

const styles = {
  header: { marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  layout: { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  sidebar: { width: '200px', flexShrink: 0, position: 'sticky', top: '110px' },
  filterSection: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px' },
  filterTitle: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '12px' },
  filterBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginBottom: '2px', textTransform: 'capitalize' },
  empty: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: '64px', color: 'var(--border2)', marginBottom: '16px' },
  emptyText: { fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '8px' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' },
  pageBtn: { width: '36px', height: '36px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' },
};
