"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/tenant", icon: HomeIcon },
  { name: "Pesanan", href: "/tenant/orders", icon: ShoppingBagIcon },
  { name: "Produk Saya", href: "/tenant/products", icon: ShoppingBagIcon },
  { name: "Tambah Produk", href: "/tenant/products/create", icon: ShoppingBagIcon },
  { name: "Pesan / Chat", href: "/chat", icon: ChatBubbleIcon },
];

export default function TenantSidebar({ isSidebarOpen = false, setIsSidebarOpen = () => {}, user = null }) {
  const pathname = usePathname();

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
    <>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
        
        <div className={`fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 justify-center">
               <Link href="/" title="Kembali ke Beranda HIPMORA" className="relative w-48 h-12 flex items-center justify-center hover:opacity-90 transition-opacity">
                 <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
               </Link>
            </div>

            {/* Quick Switch / Back to Dashboard Utama */}
            <div className="px-3 pt-4 pb-2 space-y-1">
              {user?.role === 'admin' ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all shadow-xs group"
                    title="Kembali ke Dashboard Admin Utama"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowUturnLeftIcon className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                      <span>Dashboard Admin</span>
                    </span>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">UTAMA</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <HomeIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                    <span>Ke Beranda Web</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all shadow-xs group"
                  title="Kembali ke Halaman Beranda Utama"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                  <span>Kembali ke Beranda Utama</span>
                </Link>
              )}
            </div>

            <nav className="mt-2 flex-1 space-y-1 px-2 border-t border-gray-100 pt-2">
              {navigation.map((item) => {
                const isActive = item.href === '/tenant' ? pathname === '/tenant' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      group flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      }
                    `}
                  >
                    <item.icon className={`flex-shrink-0 mr-4 h-6 w-6 ${isActive ? 'text-red-700' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <HomeIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 mr-3" />
              <span>Kembali ke Beranda</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors group text-left"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-400 group-hover:text-red-600 mr-3" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-24 flex-shrink-0 px-4 bg-white border-b border-gray-100">
            <div className="flex items-center justify-center w-full py-2 h-full">
              <Link href="/" title="Kembali ke Beranda HIPMORA" className="relative w-52 h-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
              </Link>
            </div>
          </div>

          {/* Quick Switch / Back to Dashboard Utama */}
          <div className="px-3 pt-3 pb-2 space-y-1 border-b border-gray-100">
            {user?.role === 'admin' ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all shadow-xs group"
                  title="Kembali ke Dashboard Admin Utama"
                >
                  <span className="flex items-center gap-2">
                    <ArrowUturnLeftIcon className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                    <span>Dashboard Admin</span>
                  </span>
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">UTAMA</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
                  title="Kembali ke Beranda HIPMORA"
                >
                  <HomeIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  <span>Ke Beranda Web</span>
                </Link>
              </>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all shadow-xs group"
                title="Kembali ke Halaman Beranda Utama"
              >
                <ArrowUturnLeftIcon className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Beranda Utama</span>
              </Link>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = item.href === '/tenant' ? pathname === '/tenant' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors duration-200
                        ${
                          isActive
                            ? "text-red-700"
                            : "text-gray-400 group-hover:text-red-600"
                        }
                      `}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-3 space-y-1">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <HomeIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 mr-3" />
              <span>Kembali ke Beranda</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors group text-left"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-400 group-hover:text-red-600 mr-3" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ArrowUturnLeftIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

// Minimal Icons from Heroicons
function HomeIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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

function ChatBubbleIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}
