/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function UserNavMenu({ user, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  
  // We can get access to context here to clear them on logout if needed
  // Since context is loaded from local storage on mount, we can clear local storage
  // and reload the window to reset context.

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Silently refresh token in background if data like role has changed in DB
  useEffect(() => {
    if (user) {
      fetch('/api/profile').then(res => res.json()).then(data => {
        if (data.role && data.role !== user.role) {
          router.refresh(); // Reload server components to reflect new role
        }
      }).catch(() => {});
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        // Clear local storage for cart and wishlist
        localStorage.removeItem('hipmora_cart');
        localStorage.removeItem('hipmora_wishlist');
        
        // Hard reload to reset all states and server components
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!user) return null;

  if (isMobile) {
    return (
      <div className="w-full text-left space-y-1">
        <div className="px-3 py-2 text-sm font-semibold text-neutral-400 flex items-center gap-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <span>Halo, {user?.name || 'User'}</span>
        </div>
        <Link 
          href="/profile" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
          onClick={() => setIsOpen(false)}
        >
          Profil Saya
        </Link>
        <Link 
          href="/profile/orders" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
          onClick={() => setIsOpen(false)}
        >
          Pesanan Saya
        </Link>
        <Link 
          href="/chat" 
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
          onClick={() => setIsOpen(false)}
        >
          Pesan / Chat
        </Link>
        {(user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
          <Link 
            href="/admin" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
            onClick={() => setIsOpen(false)}
          >
            Dashboard Admin
          </Link>
        )}
        {(user.role === 'tenant' || user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
          <>
            <Link 
              href="/tenant" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              Dashboard Penjual
            </Link>
            <Link 
              href="/tenant/products/create" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              Tambah Produk Baru
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-neutral-800"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 p-1 sm:pl-2 sm:pr-4 sm:py-1.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 flex items-center gap-1 sm:gap-2"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-red-400" />
        ) : (
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <span className="hidden sm:block truncate sm:max-w-[150px]">{(user?.name || 'User').split(' ')[0]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`hidden sm:block h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Profil Saya
            </Link>
            <Link 
              href="/profile/orders" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Pesanan Saya
            </Link>
            <Link 
              href="/chat" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Pesan / Chat
            </Link>

            {/* Dashboard Links for specific roles */}
            {(user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
              <Link 
                href="/admin" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Dashboard Admin
              </Link>
            )}
            {(user.role === 'tenant' || user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
              <>
                <Link 
                  href="/tenant" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard Penjualan
                </Link>
                <Link 
                  href="/tenant/products/create" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Tambah Produk Baru
                </Link>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-100 mt-1 pt-2"
              role="menuitem"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
