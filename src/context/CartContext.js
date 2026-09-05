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
            const key = item.cartItemId || item._id;
            if (mergedMap.has(key)) {
              const existing = mergedMap.get(key);
              existing.quantity += (item.quantity || 1);
            } else {
              mergedMap.set(key, { ...item });
            }
          };

          localCart.forEach(addToMap);
          dbCart.forEach(addToMap);
          
          const mergedCart = Array.from(mergedMap.values());
          setCart(mergedCart);
          
          // Sync back to db
          const syncRes = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: mergedCart })
          });
          
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.validCartIds) {
              const finalCart = mergedCart.filter(item => syncData.validCartIds.includes(item._id));
              setCart(finalCart);
            }
          }
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
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.validCartIds) {
          const finalCart = cart.filter(item => data.validCartIds.includes(item._id));
          if (finalCart.length !== cart.length) {
            setCart(finalCart); // Removes invalid products dynamically
          }
        }
      })
      .catch(() => {});
    }
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    setCart((prev) => {
      const newKey = product.cartItemId || product._id;
      const exists = prev.find((item) => (item.cartItemId || item._id) === newKey);
      if (exists) {
        // Increment quantity if already exists
        return prev.map((item) =>
          (item.cartItemId || item._id) === newKey ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item._id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => 
      prev.map((item) => 
        (item.cartItemId || item._id) === cartItemId ? { ...item, quantity } : item
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
