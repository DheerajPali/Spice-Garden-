import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, CartContextType } from '../types';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allCarts, setAllCarts] = useState<Record<string, CartItem[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    const savedCarts = localStorage.getItem('carts');
    if (savedCarts) {
      setAllCarts(JSON.parse(savedCarts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carts', JSON.stringify(allCarts));
  }, [allCarts]);

  const getUserId = () => user?.id || 'guest';

  const items = allCarts[getUserId()] || [];

  const addItem = (item: MenuItem, quantity: number = 1) => {
    const userId = getUserId();
    setAllCarts(prevCarts => {
      const userCart = prevCarts[userId] || [];
      const existingItem = userCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return {
          ...prevCarts,
          [userId]: userCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          )
        };
      }
      
      return {
        ...prevCarts,
        [userId]: [...userCart, { ...item, quantity }]
      };
    });
  };

  const removeItem = (itemId: string) => {
    const userId = getUserId();
    setAllCarts(prevCarts => ({
      ...prevCarts,
      [userId]: (prevCarts[userId] || []).filter(item => item.id !== itemId)
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const userId = getUserId();
    setAllCarts(prevCarts => ({
      ...prevCarts,
      [userId]: (prevCarts[userId] || []).map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const clearCart = () => {
    const userId = getUserId();
    setAllCarts(prevCarts => ({
      ...prevCarts,
      [userId]: []
    }));
  };

  const getItemQuantity = (itemId: string): number => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};