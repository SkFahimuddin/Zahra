import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggle } = useWishlist();

  const load = () => {
    axios.get('/api/wishlist').then(r => setProducts(r.data.products || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRemove = async (id) => { await toggle(id); setProducts(p => p.filter(x => x._id !== id)); };
  const handleCart = async (id) => { await addToCart(id, 1); toast.success('Added to cart ✦'); };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  return (
    <div className="page"><div className="container">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '6px', marginBottom: '40px' }}>MY WISHLIST</h1>
      {!products.length ? (
        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
          <div style={{ fontSize: '48px', color: 'var(--border2)', marginBottom: '16px' }}>♡</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '4px', color: 'var(--text3)', marginBottom: '24px' }}>YOUR WISHLIST IS EMPTY</h3>
          <Link to="/shop" className="btn btn-gold">EXPLORE FRAGRANCES</Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} style={{ background: 'var(--black)', position: 'relative' }}>
              <Link to={`/product/${p._id}`} style={{ display: 'block', paddingBottom: '100%', position: 'relative', overflow: 'hidden', background: 'var(--surface)' }}>
                {p.images?.[0]
                  ? <img src={p.images[0]} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--border2)', opacity: 0.3 }}>✦</div>
                }
              </Link>
              <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '4px' }}>{p.category}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--cream)', marginBottom: '8px' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--gold)', marginBottom: '16px' }}>${p.price}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleCart(p._id)} className="btn btn-gold btn-sm" style={{ flex: 1 }}>ADD TO CART</button>
                  <button onClick={() => handleRemove(p._id)} style={{ padding: '8px 12px', background: 'none', border: '1px solid var(--border)', color: 'var(--text3)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></div>
  );
}
