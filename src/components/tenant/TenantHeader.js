"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/public/NotificationBell";

export default function TenantHeader({ setIsSidebarOpen = () => {}, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
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
          setUser({ id: data._id, name: data.name, role: data.role, avatar: data.avatar });
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
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-3 sm:px-6 flex justify-between items-center">
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

        <div className="ml-2 md:ml-4 flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          {/* Tombol Back ke Dashboard Utama */}
          {user?.role === 'admin' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-red-700 hover:bg-red-800 transition-all shadow-xs group"
                title="Kembali ke Dashboard Admin Utama"
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Dashboard Utama</span>
                <span className="sm:hidden">Admin</span>
              </Link>
              <Link
                href="/"
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Kembali ke Beranda HIPMORA"
              >
                <HomeIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>Beranda</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-red-700 hover:bg-red-800 transition-all shadow-xs group"
              title="Kembali ke Halaman Beranda Utama"
            >
              <ArrowUturnLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Link>
          )}

          <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

          {user ? (
            <NotificationBell user={user} />
          ) : (
            <button
              type="button"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                   <img 
                     src={user.avatar} 
                     alt="Avatar" 
                     className="w-full h-full object-cover" 
                     onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = '/images/placeholder.png';
                     }}
                   />
                 ) : (
                   <span className="text-red-700 font-bold text-xs md:text-sm">
                     {user?.name ? user.name.charAt(0).toUpperCase() : 'TN'}
                   </span>
                 )}
              </div>
              <span className="ml-2 pr-2 font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                {user?.name || 'Tenant User'}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg bg-white ring-1 ring-black/5 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-500 font-medium">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Tenant'}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-mono uppercase px-1.5 py-0.5 bg-red-50 text-red-700 rounded font-semibold">
                    {user?.role === 'admin' ? 'Administrator' : 'Tenant / Penjual'}
                  </span>
                </div>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-700 hover:bg-red-50 font-medium transition-colors"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <ShieldCheckIcon className="w-4 h-4 text-red-600" />
                    <span>Dashboard Admin Utama</span>
                  </Link>
                )}
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <HomeIcon className="w-4 h-4 text-gray-400" />
                  <span>Beranda Toko / Web</span>
                </Link>
                <Link
                  href="/#tentang"
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  <span>Tentang Kami</span>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUturnLeftIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function InformationCircleIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function ArrowLeftOnRectangleIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
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
