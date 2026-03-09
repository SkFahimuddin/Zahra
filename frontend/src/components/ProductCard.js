import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [hover, setHover] = useState(false);
  const wishlisted = isWishlisted(product._id);

  const handleCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    await addToCart(product._id, 1);
    toast.success('Added to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    const added = await toggle(product._id);
    toast(added ? '✦ Added to wishlist' : 'Removed from wishlist');
  };

  const stars = Math.round(product.avgRating || 0);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product._id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'block', position: 'relative', overflow: 'hidden', background: 'var(--black)', transition: 'all 0.3s' }}>

      <div style={{ position: 'relative', paddingBottom: '120%', overflow: 'hidden', background: 'var(--surface)' }}>
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hover ? 'scale(1.06)' : 'scale(1)' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '48px', opacity: 0.15 }}>✦</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)' }}>NO IMAGE</div>
            </div>
        }

        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {discount > 0 && <span className="badge badge-gold">-{discount}%</span>}
          {product.featured && <span className="badge" style={{ background: 'var(--gold)', color: 'var(--black)' }}>NEW</span>}
          {product.stock === 0 && <span className="badge badge-red">SOLD OUT</span>}
        </div>

        <button onClick={handleWishlist} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(8,7,6,0.7)', border: '1px solid var(--border)', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
          <svg width="14" height="14" fill={wishlisted ? 'var(--gold)' : 'none'} stroke={wishlisted ? 'var(--gold)' : 'var(--text2)'} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(transparent, rgba(8,7,6,0.9))', transform: hover ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s', display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleCart} disabled={product.stock === 0} className="btn btn-gold btn-sm" style={{ width: '100%', maxWidth: '200px' }}>
            {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '4px' }}>{product.category?.toUpperCase()}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--cream)', marginBottom: '4px', letterSpacing: '1px' }}>{product.name}</div>
        {product.volume && <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)', marginBottom: '8px' }}>{product.volume} · {product.concentration}</div>}

        {product.numReviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= stars ? 'filled' : ''}`}>★</span>)}</div>
            <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>({product.numReviews})</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)', letterSpacing: '1px' }}>${product.price}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '14px', color: 'var(--text3)', textDecoration: 'line-through', fontFamily: 'var(--font-ui)' }}>${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
