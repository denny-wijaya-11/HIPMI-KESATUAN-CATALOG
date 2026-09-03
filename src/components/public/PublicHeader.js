"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import WishlistNavIcon from '@/components/public/WishlistNavIcon';
import CartIcon from '@/components/public/CartIcon';
import UserNavMenu from '@/components/public/UserNavMenu';
import NotificationBell from '@/components/public/NotificationBell';
import ChatIcon from '@/components/public/ChatIcon';

export default function PublicHeader({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinkClass = (path) => {
    const isActive = pathname === path;
    return `text-xs lg:text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
      isActive 
        ? 'text-[#C62828] font-semibold' 
        : 'text-gray-600 hover:text-[#C62828]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 pt-[env(safe-area-inset-top,0px)] shadow-sm">
      {/* Background khusus untuk status bar di HP agar teks putih bisa terbaca */}
      <div className="absolute top-0 left-0 w-full h-[env(safe-area-inset-top,0px)] bg-[#9b1c1c] z-[-1]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex items-center h-full py-2 shrink-0">
            <Link href="/" className="block h-full relative w-32 md:w-40 lg:w-48 flex items-center justify-center">
              <Image 
                src="/images/MASKOT LOGO.png" 
                alt="HIPMORA Logo" 
                fill 
                className="object-contain" 
                priority 
                sizes="(max-width: 768px) 128px, 192px" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-2 lg:space-x-5 overflow-hidden items-center justify-center mx-2 lg:mx-4">
            <Link href="/" className={navLinkClass('/')}>Beranda</Link>
            <Link href="/products" className={navLinkClass('/products')}>Produk</Link>
            <a href="/#produk" className="text-xs lg:text-sm font-medium whitespace-nowrap text-gray-600 hover:text-[#C62828] transition-colors duration-200">Katalog Unggulan</a>
            <a href="/#tentang" className="text-xs lg:text-sm font-medium whitespace-nowrap text-gray-600 hover:text-[#C62828] transition-colors duration-200">Tentang Kami</a>
            {user && (user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
              <Link href="/admin" className={navLinkClass('/admin')}>Dashboard Admin</Link>
            )}
            {user && (user.role === 'tenant' || user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
              <Link href="/tenant" className={navLinkClass('/tenant')}>Dashboard Penjualan</Link>
            )}
          </nav>

          {/* Right Section (Icons & Auth) */}
          <div className="flex items-center space-x-1.5 md:space-x-4">
            <div className="flex items-center space-x-0.5 md:space-x-3">
              <Link href="/products" className="md:hidden p-1.5 md:p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Cari Produk">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <WishlistNavIcon />
              <CartIcon />
              {user && (
                <>
                  <ChatIcon />
                  <NotificationBell />
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="">
              {user ? (
                <UserNavMenu user={user} />
              ) : (
                <Link href="/login" className="text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
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
