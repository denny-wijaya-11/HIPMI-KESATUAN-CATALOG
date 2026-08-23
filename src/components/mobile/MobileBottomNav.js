"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Sembunyikan navigasi bawah di halaman admin atau tenant (mereka punya navigasinya sendiri)
  if (pathname.startsWith('/admin') || pathname.startsWith('/tenant') || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[90] pb-safe">
      <div className="flex justify-around items-center h-16">
        
        {/* Beranda */}
        <Link href="/" onClick={triggerHaptic} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') && pathname === '/' ? 'text-[#C62828]' : 'text-gray-400 hover:text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('/') && pathname === '/' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/') && pathname === '/' ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>

        {/* Produk */}
        <Link href="/products" onClick={triggerHaptic} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/products') ? 'text-[#C62828]' : 'text-gray-400 hover:text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('/products') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/products') ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-[10px] font-medium">Katalog</span>
        </Link>

        {/* Keranjang */}
        <Link href="/cart" onClick={triggerHaptic} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/cart') ? 'text-[#C62828]' : 'text-gray-400 hover:text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('/cart') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/cart') ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[10px] font-medium">Keranjang</span>
        </Link>

        {/* Profil */}
        <Link href="/profile" onClick={triggerHaptic} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/profile') ? 'text-[#C62828]' : 'text-gray-400 hover:text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('/profile') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/profile') ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">Profil</span>
        </Link>

      </div>
    </div>
  );
}
