'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    // Only pass necessary fields to cart to save space
    const cartItem = {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      ownerName: product.owner?.name
    };
    
    addToCart(cartItem);
    setIsAdded(true);
    
    // Reset back to normal after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`p-3 rounded-2xl transition-all duration-300 border ${
        isAdded 
          ? 'bg-green-600/20 text-green-400 border-green-500/30' 
          : 'bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border-red-500/30'
      }`}
      title="Tambah ke Keranjang"
    >
      {isAdded ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
    </button>
  );
}
