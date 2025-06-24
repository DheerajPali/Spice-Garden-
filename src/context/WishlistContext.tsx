import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, MenuItem, WishlistContextType } from '../types';
import { useAuth } from './AuthContext';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allWishlists, setAllWishlists] = useState<Record<string, WishlistItem[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    const savedWishlists = localStorage.getItem('wishlists');
    if (savedWishlists) {
      setAllWishlists(JSON.parse(savedWishlists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlists', JSON.stringify(allWishlists));
  }, [allWishlists]);

  const getUserId = () => user?.id || 'guest';

  const items = allWishlists[getUserId()] || [];

  const addItem = (item: MenuItem) => {
    const userId = getUserId();
    setAllWishlists(prev => {
      const userWishlist = prev[userId] || [];
      const existingItem = userWishlist.find(wishlistItem => wishlistItem.id === item.id);
      if (existingItem) {
        return prev;
      }
      return {
        ...prev,
        [userId]: [...userWishlist, item]
      };
    });
  };

  const removeItem = (itemId: string) => {
    const userId = getUserId();
    setAllWishlists(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).filter(item => item.id !== itemId)
    }));
  };

  const isInWishlist = (itemId: string): boolean => {
    return items.some(item => item.id === itemId);
  };

  const clearWishlist = () => {
    const userId = getUserId();
    setAllWishlists(prev => ({
      ...prev,
      [userId]: []
    }));
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};