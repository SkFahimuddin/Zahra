import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, cartTotal, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  if (!items.length) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div style={{ fontSize: '64px', color: 'var(--border2)', marginBottom: '24px' }}>✦</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '6px', color: 'var(--text3)', marginBottom: '12px' }}>YOUR CART IS EMPTY</h2>
      <p style={{ color: 'var(--text3)', fontStyle: 'italic', marginBottom: '32px' }}>Discover our collection of Arabian fragrances</p>
      <Link to="/shop" className="btn btn-gold">BROWSE FRAGRANCES</Link>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '6px', marginBottom: '48px' }}>YOUR CART</h1>
        <div style={s.layout}>
          <div style={{ flex: 1 }}>
            {items.map(item => item.product && (
              <div key={item.product._id} style={s.item}>
                <div style={s.imgWrap}>
                  {item.product.images?.[0]
                    ? <img src={item.product.images[0]} alt={item.product.name} style={s.img} />
                    : <div style={{ ...s.img, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--border2)' }}>✦</div>
                  }
                </div>
                <div style={s.itemInfo}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)', marginBottom: '4px' }}>{item.product.category}</div>
                  <Link to={`/product/${item.product._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--cream)', display: 'block', marginBottom: '4px' }}>{item.product.name}</Link>
                  {item.product.volume && <div style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>{item.product.volume}</div>}
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--gold)', marginTop: '10px' }}>${item.product.price}</div>
                </div>
                <div style={s.itemRight}>
                  <div style={s.qtyWrap}>
                    <button onClick={() => updateQty(item.product._id, item.quantity - 1)} style={s.qtyBtn}>−</button>
                    <span style={s.qtyVal}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product._id, item.quantity + 1)} style={s.qtyBtn}>+</button>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
                  <button onClick={() => { removeItem(item.product._id); toast('Removed'); }} style={s.removeBtn}>REMOVE</button>
                </div>
              </div>
            ))}
          </div>

          <div style={s.summary}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '4px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>ORDER SUMMARY</div>
            <div style={s.sumRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div style={s.sumRow}><span>Shipping</span><span style={{ color: 'var(--gold)' }}>{cartTotal >= 199 ? 'FREE' : 'Calculated at checkout'}</span></div>
            <div style={s.sumTotal}><span>TOTAL</span><span style={{ color: 'var(--gold)' }}>${cartTotal.toFixed(2)}</span></div>
            <button onClick={() => navigate('/checkout')} className="btn btn-gold" style={{ width: '100%', padding: '15px', letterSpacing: '4px', marginBottom: '12px' }}>CHECKOUT</button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', color: 'var(--text3)' }}>← CONTINUE SHOPPING</Link>
            {cartTotal < 199 && (
              <div style={s.freeShip}>
                <span style={{ color: 'var(--gold)' }}>✦</span>
                <span>Add ${(199 - cartTotal).toFixed(2)} more for free shipping</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  item: { display: 'flex', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border)' },
  imgWrap: { width: '100px', height: '120px', background: 'var(--surface)', border: '1px solid var(--border)', flexShrink: 0, overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' },
  qtyWrap: { display: 'flex', alignItems: 'center', border: '1px solid var(--border)' },
  qtyBtn: { width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '16px' },
  qtyVal: { width: '36px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text)' },
  removeBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px' },
  summary: { width: '300px', flexShrink: 0, border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '130px', background: 'var(--surface)' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text2)', marginBottom: '12px', fontFamily: 'var(--font-ui)' },
  sumTotal: { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '2px', padding: '16px 0', margin: '8px 0 20px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' },
  freeShip: { display: 'flex', gap: '8px', marginTop: '16px', padding: '12px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-ui)' },
};
