import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/product/${product._id}`} style={styles.card}>
      <div style={styles.imgWrap}>
        {product.image
          ? <img src={`http://localhost:5000${product.image}`} alt={product.name} style={styles.img} />
          : <div style={styles.imgPlaceholder}><span style={styles.placeholderIcon}>⬡</span></div>
        }
        {product.itar && <span style={styles.itarBadge}>ITAR</span>}
        {product.featured && <span style={styles.featuredBadge}>FEATURED</span>}
        {product.stock === 0 && <div style={styles.outOfStock}>OUT OF STOCK</div>}
      </div>
      <div style={styles.body}>
        <div style={styles.category}>{product.category?.toUpperCase()}</div>
        <div style={styles.name}>{product.name}</div>
        {product.manufacturer && <div style={styles.manufacturer}>{product.manufacturer}</div>}
        {product.partNumber && <div style={styles.partNum}>P/N: {product.partNumber}</div>}
        <div style={styles.footer}>
          <span style={styles.price}>${product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 12px' }}
          >
            + ADD
          </button>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', display: 'block', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' },
  imgWrap: { position: 'relative', paddingBottom: '70%', background: 'var(--surface2)' },
  img: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: '48px', color: 'var(--border2)', opacity: 0.5 },
  itarBadge: { position: 'absolute', top: '8px', left: '8px', background: 'var(--gold)', color: 'var(--black)', padding: '2px 8px', fontSize: '9px', fontWeight: '700', fontFamily: 'var(--font-mono)', letterSpacing: '1px', borderRadius: '2px' },
  featuredBadge: { position: 'absolute', top: '8px', right: '8px', background: 'rgba(52,152,219,0.9)', color: 'white', padding: '2px 8px', fontSize: '9px', fontWeight: '700', fontFamily: 'var(--font-mono)', letterSpacing: '1px', borderRadius: '2px' },
  outOfStock: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--red2)', letterSpacing: '2px' },
  body: { padding: '14px' },
  category: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text3)', marginBottom: '4px' },
  name: { fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.3 },
  manufacturer: { fontSize: '12px', color: 'var(--text3)', marginBottom: '2px' },
  partNum: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', marginBottom: '12px' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' },
  price: { fontFamily: 'var(--font-mono)', fontSize: '17px', fontWeight: '700', color: 'var(--gold)' },
};
