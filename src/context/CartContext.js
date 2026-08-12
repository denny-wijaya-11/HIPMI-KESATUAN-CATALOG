'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage and sync with DB on mount
  useEffect(() => {
    const initializeCart = async () => {
      let localCart = [];
      const savedCart = localStorage.getItem('hipmora_cart');
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }

      try {
        const res = await fetch('/api/user/sync');
        if (res.ok) {
          const data = await res.json();
          const dbCart = data.cart || [];
          
          // Merge local and db carts by unique _id, adding quantities
          const mergedMap = new Map();
          
          const addToMap = (item) => {
            if (mergedMap.has(item._id)) {
              const existing = mergedMap.get(item._id);
              existing.quantity += (item.quantity || 1);
            } else {
              mergedMap.set(item._id, { ...item });
            }
          };

          localCart.forEach(addToMap);
          dbCart.forEach(addToMap);
          
          const mergedCart = Array.from(mergedMap.values());
          setCart(mergedCart);
          
          // Sync back to db
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: mergedCart })
          });
        } else {
          setCart(localCart);
        }
      } catch (err) {
        setCart(localCart);
      }
      
      setIsLoaded(true);
    };

    initializeCart();
  }, []);

  // Save to local storage and DB on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('hipmora_cart', JSON.stringify(cart));
      
      // Attempt to sync to DB (fails silently if not logged in)
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
      }).catch(() => {});
    }
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        // Increment quantity if already exists
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => 
      prev.map((item) => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
