"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import WishlistNavIcon from '@/components/public/WishlistNavIcon';
import CartIcon from '@/components/public/CartIcon';
import UserNavMenu from '@/components/public/UserNavMenu';
import NotificationBell from '@/components/public/NotificationBell';
import ChatIcon from '@/components/public/ChatIcon';

export default function PublicHeader({ user }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/products');
      return;
    }
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* LEFT: Red Circular Badge + Subtitle (Exact layout from Arda Guler reference) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Red Circular Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C62828] text-white flex flex-col items-center justify-center font-black text-[9px] sm:text-[10px] uppercase leading-tight tracking-tight shadow-xs group-hover:scale-105 transition-transform">
                <span>HIP</span>
                <span>MORA</span>
              </div>
              
              {/* Brand Meta Text */}
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 leading-tight tracking-tight group-hover:text-[#C62828] transition-colors">
                  HIPMORA Official
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:inline leading-tight">
                  Katalog &amp; Ekosistem Mahasiswa
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER / SEARCH DRAWER (Toggleable or active) */}
          {searchOpen ? (
            <div className="flex-1 max-w-lg mx-2 sm:mx-4 animate-in fade-in duration-200">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk, makanan, jasa tugas, outfit..."
                  className="w-full pl-3 pr-20 py-2 text-xs sm:text-sm bg-gray-100 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:border-[#C62828] text-gray-900"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#C62828] text-white px-3 py-1 rounded-full text-xs font-bold"
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  ✕
                </button>
              </form>
            </div>
          ) : (
            /* CENTER: Editorial Navigation Links (like Partners, Collaboration in reference) */
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-gray-700">
              <Link href="/products" className="flex items-center gap-1.5 hover:text-[#C62828] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>
                Katalog Produk
              </Link>
              <Link href="/become-tenant" className="flex items-center gap-1.5 hover:text-[#C62828] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>
                Gabung Tenant
              </Link>
              <Link href="#tentang" className="flex items-center gap-1.5 hover:text-[#C62828] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>
                Tentang Kami
              </Link>
              {user && (user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
                <Link href="/admin" className="text-[#C62828] font-bold">
                  Dashboard Admin
                </Link>
              )}
            </nav>
          )}

          {/* RIGHT: Actions & Social Icons (Exact style from reference) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Search Toggle Icon */}
            {!searchOpen && (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-[#C62828] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Cari Produk"
                aria-label="Cari Produk"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* Social Icons (TikTok, Instagram, YouTube, X like reference) */}
            <div className="hidden lg:flex items-center gap-2.5 text-gray-500 border-l border-gray-200 pl-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-pink-600 transition-colors p-1"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-black transition-colors p-1"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-black transition-colors p-1"
                aria-label="X"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Commerce Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <WishlistNavIcon />
              <CartIcon />
              {user && (
                <>
                  <ChatIcon />
                  <NotificationBell />
                </>
              )}
            </div>

            {/* Auth / Avatar Section */}
            <div>
              {user ? (
                <UserNavMenu user={user} />
              ) : (
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-bold text-white bg-[#C62828] hover:bg-[#8E0000] px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-xs"
                >
                  Masuk
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
