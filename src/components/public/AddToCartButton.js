'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product, compact = false }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault(); // Prevent default if inside a link/form
    e.stopPropagation(); // Prevent card click if overlapping
    
    // Only pass necessary fields to cart to save space
    const cartItem = {
      _id: product._id.toString(),
      cartItemId: product.selectedVariantName ? `${product._id}-${product.selectedVariantName}` : product._id.toString(),
      name: product.name,
      price: product.price,
      selectedVariantName: product.selectedVariantName,
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
      className={`rounded-full transition-all duration-300 border flex items-center justify-center font-semibold overflow-hidden ${
        compact 
          ? 'p-2 md:px-5 md:py-2.5 gap-1.5 md:gap-2 text-xs md:text-sm w-auto' 
          : 'px-3 py-2 sm:px-5 sm:py-2.5 gap-1.5 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto'
      } ${
        isAdded 
          ? 'bg-green-600/20 text-green-700 border-green-500/30' 
          : 'bg-[#C62828] hover:bg-[#8E0000] text-white border-[#C62828] shadow-sm'
      }`}
      title="Tambah ke Keranjang"
    >
      {isAdded ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4 md:h-5 md:w-5' : 'h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className={`truncate ${compact ? 'hidden md:inline' : ''}`}>Berhasil</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4 md:h-5 md:w-5' : 'h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className={`truncate ${compact ? 'hidden md:inline' : ''}`}>Tambah</span>
        </>
      )}
    </button>
  );
}
