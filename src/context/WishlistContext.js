"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeWishlist = async () => {
      let localWishlist = [];
      const storedWishlist = localStorage.getItem('hipmora_wishlist');
      if (storedWishlist) {
        try {
          localWishlist = JSON.parse(storedWishlist);
        } catch (error) {
          console.error("Failed to parse wishlist from local storage", error);
        }
      }

      try {
        const res = await fetch('/api/user/sync');
        if (res.ok) {
          const data = await res.json();
          const dbWishlist = data.wishlist || [];
          
          // Merge local and db wishlists by unique _id
          const mergedMap = new Map();
          localWishlist.forEach(item => mergedMap.set(item._id, item));
          dbWishlist.forEach(item => mergedMap.set(item._id, item));
          
          const mergedWishlist = Array.from(mergedMap.values());
          setWishlist(mergedWishlist);
          
          // Sync back to db
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wishlist: mergedWishlist })
          });
        } else {
          setWishlist(localWishlist);
        }
      } catch (err) {
        setWishlist(localWishlist);
      }
      
      setIsLoaded(true);
    };

    initializeWishlist();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('hipmora_wishlist', JSON.stringify(wishlist));
      
      // Attempt to sync to DB (fails silently if not logged in)
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist })
      }).catch(() => {});
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, isLoaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
