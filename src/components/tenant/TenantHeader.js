"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/public/NotificationBell";

export default function TenantHeader({ setIsSidebarOpen = () => {} }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser({ id: data._id, name: data.name, role: data.role });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tenant/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/tenant/products`);
    }
  };
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex items-center min-w-0">
          <form onSubmit={handleSearch} className="w-full max-w-[130px] sm:max-w-xs relative text-gray-400 focus-within:text-gray-600">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
            </div>
            <input
              id="search"
              className="block w-full h-full pl-7 pr-2 md:pl-8 md:pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-xs sm:text-sm transition-colors bg-transparent"
              placeholder="Cari..."
              type="search"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="ml-2 md:ml-4 flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          {user ? (
            <NotificationBell user={user} />
          ) : (
            <button
              type="button"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          {/* Profile dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 p-1 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200">
                 {user?.avatar ? (
                   <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-red-700 font-bold text-xs md:text-sm">
                     {user?.name ? user.name.charAt(0).toUpperCase() : 'TN'}
                   </span>
                 )}
              </div>
              <span className="ml-2 pr-2 font-medium text-gray-700 hidden sm:block">
                {user?.name || 'Tenant User'}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <a
                    href={`/products?search=${encodeURIComponent(user?.name || '')}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Lihat Toko Saya
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    role="menuitem"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bars3Icon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function MagnifyingGlassIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
