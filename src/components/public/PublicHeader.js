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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
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
            <Link href="/#tentang" className="text-sm font-medium text-gray-600 hover:text-[#C62828] transition-colors duration-200">Tentang Kami</Link>
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

            {/* Mobile Menu Button */}
            <button 
              type="button"
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Buka menu utama</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === '/' ? 'text-[#C62828] bg-red-50' : 'text-gray-700 hover:text-[#C62828] hover:bg-gray-50'}`}
            >
              Beranda
            </Link>
            <Link 
              href="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === '/products' ? 'text-[#C62828] bg-red-50' : 'text-gray-700 hover:text-[#C62828] hover:bg-gray-50'}`}
            >
              Produk
            </Link>
            <Link 
              href="/#produk" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-[#C62828] hover:bg-gray-50"
            >
              Katalog Unggulan
            </Link>
            <Link 
              href="/#tentang" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-[#C62828] hover:bg-gray-50"
            >
              Tentang Kami
            </Link>
          </div>
          
          <div className="pt-3 pb-4 border-t border-gray-100 px-4 flex flex-col space-y-3">
            {user ? (
              <UserNavMenu user={user} isMobile={true} />
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] transition-colors"
              >
                Masuk HIPMORA
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
