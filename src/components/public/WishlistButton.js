"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

export default function WishlistButton({ product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoaded } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isLoaded) return null; // Prevent hydration mismatch

  const isSaved = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`absolute top-5 left-5 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-10 ${
        isSaved 
          ? 'bg-red-500/90 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
          : 'bg-black/40 border-white/10 text-white/70 hover:bg-black/60 hover:text-white hover:scale-110'
      }`}
      aria-label="Add to wishlist"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isSaved ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-5 h-5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
