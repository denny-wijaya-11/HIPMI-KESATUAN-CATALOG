"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

export default function WishlistNavIcon() {
  const { wishlist, isLoaded } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="relative p-1.5 sm:p-2 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    );
  }

  const itemCount = wishlist.length;

  return (
    <Link href="/wishlist" className="relative p-1.5 sm:p-2 text-gray-600 hover:text-[#C62828] transition-colors group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" fill={itemCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute right-0 top-0 -mr-1 -mt-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)]">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
