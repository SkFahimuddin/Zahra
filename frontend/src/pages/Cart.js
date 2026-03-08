import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, cartLoading } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  if (cartLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;

  if (items.length === 0) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>⬡</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '3px', color: 'var(--text2)', marginBottom: '8px' }}>CART IS EMPTY</h2>
      <p style={{ color: 'var(--text3)', marginBottom: '24px' }}>No items added yet</p>
      <Link to="/shop" className="btn btn-primary">BROWSE PRODUCTS</Link>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '32px' }}>YOUR CART</h1>
        <div style={styles.layout}>
          {/* Items */}
          <div style={{ flex: 1 }}>
            {items.map(item => item.product && (
              <div key={item.product._id} style={styles.item}>
                <div style={styles.imgWrap}>
                  {item.product.image
                    ? <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} style={styles.img} />
                    : <div style={styles.imgPlaceholder}>⬡</div>
                  }
                </div>
                <div style={styles.itemInfo}>
                  <div style={styles.itemCategory}>{item.product.category?.toUpperCase()}</div>
                  <Link to={`/product/${item.product._id}`} style={styles.itemName}>{item.product.name}</Link>
                  {item.product.partNumber && <div style={styles.itemPN}>P/N: {item.product.partNumber}</div>}
                  <div style={styles.itemPrice}>${item.product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div style={styles.itemActions}>
                  <div style={styles.qtyWrap}>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                    <span style={styles.qtyVal}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                  </div>
                  <div style={styles.itemTotal}>${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <button onClick={() => { removeFromCart(item.product._id); toast.success('Removed'); }} style={styles.removeBtn}>✕ REMOVE</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={styles.summary}>
            <div style={styles.summaryTitle}>ORDER SUMMARY</div>
            <div style={styles.summaryRow}>
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: 'var(--green)' }}>TBD</span>
            </div>
            <div style={styles.summaryTotal}>
              <span>TOTAL</span>
              <span style={{ color: 'var(--gold)' }}>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              PROCEED TO CHECKOUT
            </button>
            <Link to="/shop" style={styles.continueLink}>← CONTINUE SHOPPING</Link>

            <div style={styles.itarNote}>
              <span>⚠</span>
              <span>All items are ITAR-controlled. By proceeding, you confirm you are a US person authorized to possess these items.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  item: { display: 'flex', gap: '20px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '12px' },
  imgWrap: { width: '80px', height: '80px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { fontSize: '28px', color: 'var(--border2)' },
  itemInfo: { flex: 1 },
  itemCategory: { fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--text3)', marginBottom: '4px' },
  itemName: { fontSize: '15px', fontWeight: '600', color: 'var(--text)', display: 'block', marginBottom: '4px' },
  itemPN: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' },
  itemPrice: { fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--text2)' },
  itemActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  qtyWrap: { display: 'flex', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px' },
  qtyBtn: { width: '30px', height: '30px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '16px' },
  qtyVal: { width: '32px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text)' },
  itemTotal: { fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '700', color: 'var(--gold)' },
  removeBtn: { background: 'none', border: 'none', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer' },
  summary: { width: '320px', flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', position: 'sticky', top: '110px' },
  summaryTitle: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text2)', marginBottom: '12px' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-mono)', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '20px' },
  continueLink: { display: 'block', textAlign: 'center', marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px' },
  itarNote: { display: 'flex', gap: '8px', marginTop: '16px', padding: '12px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: '4px', fontSize: '11px', color: 'var(--text3)', lineHeight: 1.6 },
};
