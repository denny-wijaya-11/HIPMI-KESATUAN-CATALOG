'use client';

import Link from 'next/link';

const CATEGORIES = [
  {
    name: 'Makanan',
    label: 'Makanan',
    href: '/products?category=Makanan',
    icon: (
      <svg className="w-6 h-6 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-3 0-6 2-6 5h12c0-3-3-5-6-5zM4 15h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    bg: 'bg-red-50 group-hover:bg-red-100 border-red-100',
  },
  {
    name: 'Minuman',
    label: 'Minuman',
    href: '/products?category=Minuman',
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 3h4M10 5h4M6 8l2 11h8l2-11H6z" />
      </svg>
    ),
    bg: 'bg-amber-50 group-hover:bg-amber-100 border-amber-100',
  },
  {
    name: 'Fashion',
    label: 'Fashion',
    href: '/products?category=Fashion',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8l4-2h6l4 2v4l-2 1v7H7v-7L5 12V8z" />
      </svg>
    ),
    bg: 'bg-indigo-50 group-hover:bg-indigo-100 border-indigo-100',
  },
  {
    name: 'Jasa',
    label: 'Jasa',
    href: '/products?category=Jasa',
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    ),
    bg: 'bg-emerald-50 group-hover:bg-emerald-100 border-emerald-100',
  },
  {
    name: 'Aksesoris',
    label: 'Aksesoris',
    href: '/products?category=Aksesoris',
    icon: (
      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6a4 4 0 00-4 4 4 4 0 108 0 4 4 0 00-4-4zM6 14h12l1 6H5l1-6z" />
      </svg>
    ),
    bg: 'bg-rose-50 group-hover:bg-rose-100 border-rose-100',
  },
  {
    name: 'Perlengkapan',
    label: 'Kebutuhan Kos',
    href: '/products?category=Perlengkapan',
    icon: (
      <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    bg: 'bg-sky-50 group-hover:bg-sky-100 border-sky-100',
  },
  {
    name: 'Semua',
    label: 'Semua Produk',
    href: '/products',
    icon: (
      <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    bg: 'bg-gray-100 group-hover:bg-gray-200 border-gray-200',
  },
];

export default function CategoryIconStrip() {
  return (
    <section className="py-3 md:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-3 sm:p-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center text-center p-1.5 sm:p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 border transition-transform duration-200 group-hover:scale-108 group-hover:shadow-xs ${cat.bg}`}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#C62828] line-clamp-1 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
