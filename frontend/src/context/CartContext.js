import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [] }); return; }
    setLoading(true);
    try { const { data } = await axios.get('/api/cart'); setCart(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart  = async (productId, qty = 1) => { const { data } = await axios.post('/api/cart/add', { productId, quantity: qty }); setCart(data); };
  const updateQty  = async (productId, qty) => { const { data } = await axios.put('/api/cart/update', { productId, quantity: qty }); setCart(data); };
  const removeItem = async (productId) => { const { data } = await axios.delete(`/api/cart/remove/${productId}`); setCart(data); };
  const clearCart  = async () => { await axios.delete('/api/cart/clear'); setCart({ items: [] }); };

  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0) || 0;

  return <CartContext.Provider value={{ cart, loading, cartCount, cartTotal, addToCart, updateQty, removeItem, clearCart, fetchCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
