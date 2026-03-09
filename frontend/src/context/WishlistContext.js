import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (!user) { setWishlist([]); return; }
    try { const { data } = await axios.get('/api/wishlist'); setWishlist(data.products?.map(p => p._id) || []); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const toggle = async (productId) => {
    try {
      const { data } = await axios.post(`/api/wishlist/toggle/${productId}`);
      setWishlist(prev => data.added ? [...prev, productId] : prev.filter(id => id !== productId));
      return data.added;
    } catch (e) { console.error(e); return false; }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, fetchWishlist }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
