import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setCartLoading(true);
      const res = await axios.get('/api/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await axios.post('/api/cart/add', { productId, quantity });
    setCart(res.data);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await axios.put('/api/cart/update', { productId, quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await axios.delete(`/api/cart/remove/${productId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    await axios.delete('/api/cart/clear');
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
