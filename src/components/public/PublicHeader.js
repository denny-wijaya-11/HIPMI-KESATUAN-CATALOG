"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import WishlistNavIcon from '@/components/public/WishlistNavIcon';
import CartIcon from '@/components/public/CartIcon';
import UserNavMenu from '@/components/public/UserNavMenu';

export default function PublicHeader({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/40 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-28">
          
          {/* Logo */}
          <div className="flex items-center group cursor-pointer h-full py-2">
            <Link href="/">
              <div className="relative w-40 md:w-64 h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/images/MASKOT LOGO.png" 
                  alt="HIPMORA Logo" 
                  fill 
                  className="object-contain" 
                  priority 
                  sizes="(max-width: 768px) 160px, 256px" 
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className={`text-sm font-medium transition-colors relative pb-1 ${pathname === '/' ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-red-500' : 'text-neutral-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300'}`}>Beranda</Link>
            <Link href="/products" className={`text-sm font-medium transition-colors relative pb-1 ${pathname === '/products' ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-red-500' : 'text-neutral-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300'}`}>Produk</Link>
            <Link href="/#produk" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Katalog Unggulan</Link>
            <Link href="/#tentang" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Tentang Kami</Link>
          </nav>

          {/* Right Section (Icons & Auth) */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              <WishlistNavIcon />
              <CartIcon />
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:block">
              {user ? (
                <UserNavMenu user={user} />
              ) : (
                <Link href="/login" className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500">
                  Login HIPMORA
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
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
        <div className="md:hidden bg-neutral-900 border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'text-white bg-neutral-800' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'}`}
            >
              Beranda
            </Link>
            <Link 
              href="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/products' ? 'text-white bg-neutral-800' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'}`}
            >
              Produk
            </Link>
            <Link 
              href="/#produk" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              Katalog Unggulan
            </Link>
            <Link 
              href="/#tentang" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              Tentang Kami
            </Link>
          </div>
          
          <div className="pt-4 pb-4 border-t border-white/10 px-4 flex flex-col space-y-4">
            {user ? (
              <UserNavMenu user={user} isMobile={true} />
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Login HIPMORA
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
