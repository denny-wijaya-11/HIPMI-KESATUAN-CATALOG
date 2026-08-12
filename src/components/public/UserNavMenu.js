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
        <div className="px-3 py-2 text-sm font-semibold text-neutral-400">
          Halo, {user?.name || 'User'}
        </div>
        {(user.role === 'admin' || user.role === 'developer' || user.role === 'operator') && (
          <Link 
            href="/admin" 
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-neutral-800 hover:bg-neutral-700"
          >
            Dashboard Admin
          </Link>
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
        className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 flex items-center gap-2"
      >
        <span className="truncate max-w-[100px] sm:max-w-[150px]">Halo, {(user?.name || 'User').split(' ')[0]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* Dashboard Link if user has access */}
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
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
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
