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
    return `text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'text-[#C62828] font-semibold' 
        : 'text-gray-600 hover:text-[#C62828]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 pt-[env(safe-area-inset-top,0px)]">
      {/* Background khusus untuk status bar di HP agar teks putih bisa terbaca */}
      <div className="absolute top-0 left-0 w-full h-[env(safe-area-inset-top,0px)] bg-[#9b1c1c] z-[-1]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex items-center h-full py-2">
            <Link href="/" className="block h-full relative w-32 md:w-48 flex items-center justify-center">
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
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={navLinkClass('/')}>Beranda</Link>
            <Link href="/products" className={navLinkClass('/products')}>Produk</Link>
            <Link href="/#produk" className="text-sm font-medium text-gray-600 hover:text-[#C62828] transition-colors duration-200">Katalog Unggulan</Link>
            <Link href="/#footer" className="text-sm font-medium text-gray-600 hover:text-[#C62828] transition-colors duration-200">Tentang Kami</Link>
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
              <WishlistNavIcon />
              <CartIcon />
              {user && (
                <>
                  <ChatIcon />
                  <NotificationBell />
                </>
              )}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:block">
              {user ? (
                <UserNavMenu user={user} />
              ) : (
                <Link href="/login" className="text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
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
