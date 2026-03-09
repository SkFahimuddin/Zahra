import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [myReview, setMyReview] = useState({ rating: 5, title: '', body: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([axios.get(`/api/products/${id}`), axios.get(`/api/reviews/product/${id}`)])
      .then(([p, r]) => { setProduct(p.data); setReviews(r.data); })
      .catch(() => toast.error('Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    await addToCart(product._id, qty);
    toast.success('Added to cart ✦');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    const added = await toggle(product._id);
    toast(added ? '✦ Added to wishlist' : 'Removed from wishlist');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); return; }
    try {
      const { data } = await axios.post(`/api/reviews/product/${id}`, myReview);
      setReviews(data);
      const p = await axios.get(`/api/products/${id}`);
      setProduct(p.data);
      setShowReviewForm(false);
      toast.success('Review submitted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner" /></div>;
  if (!product) return null;

  const stars = Math.round(product.avgRating || 0);

  return (
    <div className="page">
      <div className="container">
        <div style={s.breadcrumb}>
          <Link to="/" style={s.breadLink}>Home</Link>
          <span style={{ color: 'var(--border2)' }}> / </span>
          <Link to="/shop" style={s.breadLink}>Shop</Link>
          <span style={{ color: 'var(--border2)' }}> / </span>
          <span style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{product.name}</span>
        </div>

        <div style={s.layout}>
          <div style={s.imageSection}>
            <div style={s.imageWrap}>
              {product.images?.[0]
                ? <img src={product.images[0]} alt={product.name} style={s.image} />
                : <div style={s.imagePlaceholder}><span style={{ fontSize: '80px', color: 'var(--border2)', opacity: 0.3 }}>✦</span></div>
              }
            </div>
          </div>

          <div style={s.info}>
            <div style={s.category}>{product.category}</div>
            <h1 style={s.name}>{product.name}</h1>
            {(product.volume || product.concentration) && (
              <div style={s.specs}>{product.volume} · {product.concentration}</div>
            )}
            <div style={s.ratingRow}>
              <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= stars ? 'filled' : ''}`} style={{ fontSize: '18px' }}>★</span>)}</div>
              <span style={{ fontSize: '14px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</span>
            </div>
            <div style={s.priceRow}>
              <span style={s.price}>${product.price}</span>
              {product.originalPrice > product.price && <span style={s.oldPrice}>${product.originalPrice}</span>}
            </div>
            <p style={s.desc}>{product.description}</p>
            <div style={{ marginBottom: '24px' }}>
              <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                {product.stock > 0 ? `IN STOCK (${product.stock} left)` : 'SOLD OUT'}
              </span>
            </div>
            {product.stock > 0 && (
              <div style={s.addRow}>
                <div style={s.qtyWrap}>
                  <button onClick={() => setQty(Math.max(1, qty-1))} style={s.qtyBtn}>−</button>
                  <span style={s.qtyVal}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty+1))} style={s.qtyBtn}>+</button>
                </div>
                <button onClick={handleCart} className="btn btn-gold" style={{ flex: 1, letterSpacing: '3px' }}>ADD TO CART</button>
                <button onClick={handleWishlist} style={s.wishBtn}>
                  <svg width="18" height="18" fill={isWishlisted(product._id) ? 'var(--gold)' : 'none'} stroke={isWishlisted(product._id) ? 'var(--gold)' : 'var(--text2)'} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
              </div>
            )}
            <div style={s.detailsBox}>
              {[['Category', product.category], ['Volume', product.volume], ['Concentration', product.concentration], ['Stock', product.stock]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={s.detailRow}>
                  <span style={s.detailKey}>{k}</span>
                  <span style={s.detailVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.reviewsSection}>
          <div style={s.reviewsHeader}>
            <h2 style={s.reviewsTitle}>REVIEWS <span style={{ color: 'var(--text3)', fontSize: '18px' }}>({reviews.length})</span></h2>
            {user && <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn btn-outline btn-sm">WRITE A REVIEW</button>}
          </div>
          {showReviewForm && (
            <form onSubmit={submitReview} style={s.reviewForm}>
              <div style={{ marginBottom: '16px' }}>
                <label style={s.reviewLabel}>RATING</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} onClick={() => setMyReview(r => ({ ...r, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: n <= myReview.rating ? 'var(--gold)' : 'var(--border2)' }}>★</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={s.reviewLabel}>TITLE</label>
                <input value={myReview.title} onChange={e => setMyReview(r => ({ ...r, title: e.target.value }))} className="input" placeholder="Summarize your experience" style={{ marginTop: '6px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={s.reviewLabel}>REVIEW</label>
                <textarea value={myReview.body} onChange={e => setMyReview(r => ({ ...r, body: e.target.value }))} className="input" rows="4" placeholder="Share your thoughts..." style={{ marginTop: '6px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-gold btn-sm">SUBMIT</button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-dark btn-sm">CANCEL</button>
              </div>
            </form>
          )}
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontStyle: 'italic', padding: '32px 0' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={s.reviewsList}>
              {reviews.map(r => (
                <div key={r._id} style={s.reviewCard}>
                  <div style={s.reviewTop}>
                    <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= r.rating ? 'filled' : ''}`}>★</span>)}</div>
                    <span style={s.reviewAuthor}>{r.user?.name}</span>
                    <span style={s.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.title && <div style={s.reviewTitle}>{r.title}</div>}
                  {r.body && <p style={s.reviewBody}>{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  breadcrumb: { fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text3)', marginBottom: '40px' },
  breadLink: { color: 'var(--text3)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'flex-start', marginBottom: '80px' },
  imageSection: { position: 'sticky', top: '130px' },
  imageWrap: { border: '1px solid var(--border)', paddingBottom: '100%', position: 'relative', overflow: 'hidden', background: 'var(--surface)' },
  image: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: {},
  category: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '4px', color: 'var(--gold)', marginBottom: '12px' },
  name: { fontFamily: 'var(--font-display)', fontSize: '44px', letterSpacing: '4px', color: 'var(--cream)', marginBottom: '8px', fontWeight: 400, lineHeight: 1.1 },
  specs: { fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text3)', marginBottom: '16px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  price: { fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--gold)', letterSpacing: '2px' },
  oldPrice: { fontFamily: 'var(--font-ui)', fontSize: '20px', color: 'var(--text3)', textDecoration: 'line-through' },
  desc: { fontSize: '16px', color: 'var(--text2)', lineHeight: 1.9, fontStyle: 'italic', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  addRow: { display: 'flex', gap: '12px', alignItems: 'stretch', marginBottom: '32px' },
  qtyWrap: { display: 'flex', alignItems: 'center', border: '1px solid var(--border)', background: 'var(--surface)' },
  qtyBtn: { width: '40px', height: '48px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '20px', cursor: 'pointer' },
  qtyVal: { width: '44px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text)', letterSpacing: '2px' },
  wishBtn: { width: '48px', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  detailsBox: { border: '1px solid var(--border)' },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '14px' },
  detailKey: { color: 'var(--text3)', fontFamily: 'var(--font-ui)' },
  detailVal: { color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  reviewsSection: { borderTop: '1px solid var(--border)', paddingTop: '48px' },
  reviewsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  reviewsTitle: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '4px' },
  reviewForm: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: '32px' },
  reviewLabel: { fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' },
  reviewCard: { background: 'var(--black)', padding: '24px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' },
  reviewAuthor: { fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '2px', color: 'var(--cream)' },
  reviewDate: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)', marginLeft: 'auto' },
  reviewTitle: { fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1px', color: 'var(--text)', marginBottom: '8px' },
  reviewBody: { fontSize: '15px', color: 'var(--text2)', fontStyle: 'italic', lineHeight: 1.8 },
};
