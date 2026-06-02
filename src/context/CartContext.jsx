import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    setLoading(true);
    try {
      const res = await cartAPI.get();
      setCart(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = useCallback(async (bookId, quantity = 1) => {
    const res = await cartAPI.addItem({ bookId, quantity });
    setCart(res.data);
    return res;
  }, []);

  const updateItem = useCallback(async (bookId, quantity) => {
    const res = await cartAPI.updateItem(bookId, { quantity });
    setCart(res.data);
  }, []);

  const removeItem = useCallback(async (bookId) => {
    const res = await cartAPI.removeItem(bookId);
    setCart(res.data);
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart(null);
  }, []);

  const totalItems = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  // B2: Backend trả unitPrice (không phải price)
  const totalPrice = cart?.items?.reduce((s, i) => s + i.unitPrice * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, totalItems, totalPrice, addItem, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
