import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      await addToCart(product._id, qty);
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;
  if (!product) return <div className="container page"><p>Product not found</p></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.breadLink}>HOME</Link>
          <span style={styles.breadSep}>/</span>
          <Link to="/shop" style={styles.breadLink}>SHOP</Link>
          <span style={styles.breadSep}>/</span>
          <span style={{ color: 'var(--text2)' }}>{product.name.toUpperCase()}</span>
        </div>

        <div style={styles.layout}>
          {/* Image */}
          <div style={styles.imgSection}>
            <div style={styles.imgWrap}>
              {product.image
                ? <img src={`http://localhost:5000${product.image}`} alt={product.name} style={styles.img} />
                : <div style={styles.imgPlaceholder}><span style={{ fontSize: '80px', color: 'var(--border2)' }}>⬡</span></div>
              }
            </div>
            {product.itar && (
              <div style={styles.itarNotice}>
                <span style={styles.itarIcon}>⚠</span>
                <div>
                  <div style={styles.itarTitle}>ITAR CONTROLLED ITEM</div>
                  <div style={styles.itarText}>This item is subject to the International Traffic in Arms Regulations. US persons only.</div>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={styles.info}>
            <div style={styles.category}>{product.category?.toUpperCase()}</div>
            <h1 style={styles.name}>{product.name}</h1>

            {(product.manufacturer || product.partNumber) && (
              <div style={styles.meta}>
                {product.manufacturer && <span style={styles.metaItem}>Manufacturer: <strong>{product.manufacturer}</strong></span>}
                {product.partNumber && <span style={styles.metaItem}>P/N: <strong style={{ fontFamily: 'var(--font-mono)' }}>{product.partNumber}</strong></span>}
              </div>
            )}

            <div style={styles.price}>${product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

            <div style={styles.stock}>
              <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                {product.stock > 0 ? `IN STOCK (${product.stock})` : 'OUT OF STOCK'}
              </span>
            </div>

            <div style={styles.desc}>{product.description}</div>

            {product.stock > 0 && (
              <div style={styles.addSection}>
                <div style={styles.qtyWrap}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyVal}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }}>
                  ADD TO CART
                </button>
              </div>
            )}

            <div style={styles.specs}>
              <div style={styles.specsTitle}>PRODUCT DETAILS</div>
              {[
                ['Category', product.category],
                ['Stock', product.stock],
                ['ITAR Controlled', product.itar ? 'Yes' : 'No'],
                product.partNumber && ['Part Number', product.partNumber],
                product.manufacturer && ['Manufacturer', product.manufacturer],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={styles.specRow}>
                  <span style={styles.specKey}>{k}</span>
                  <span style={styles.specVal}>{v?.toString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  breadcrumb: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px' },
  breadLink: { color: 'var(--text3)', transition: 'color 0.2s' },
  breadSep: { color: 'var(--border2)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-start' },
  imgSection: { position: 'sticky', top: '110px' },
  imgWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', paddingBottom: '80%', position: 'relative', marginBottom: '16px' },
  img: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itarNotice: { background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '6px', padding: '12px 16px', display: 'flex', gap: '12px' },
  itarIcon: { color: 'var(--red2)', fontSize: '20px', flexShrink: 0 },
  itarTitle: { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', color: 'var(--red2)', marginBottom: '4px' },
  itarText: { fontSize: '12px', color: 'var(--text3)' },
  category: { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '8px' },
  name: { fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px', color: 'var(--text)', marginBottom: '16px', lineHeight: 1.1 },
  meta: { display: 'flex', gap: '20px', marginBottom: '20px' },
  metaItem: { fontSize: '13px', color: 'var(--text3)' },
  price: { fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '12px' },
  stock: { marginBottom: '20px' },
  desc: { fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid var(--border)' },
  addSection: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' },
  qtyWrap: { display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' },
  qtyBtn: { width: '36px', height: '44px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '18px', cursor: 'pointer' },
  qtyVal: { width: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '16px' },
  specs: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px' },
  specsTitle: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text3)', marginBottom: '16px' },
  specRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' },
  specKey: { color: 'var(--text3)' },
  specVal: { color: 'var(--text)', fontWeight: '500' },
};
