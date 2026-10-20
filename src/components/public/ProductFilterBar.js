'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  {
    name: 'Semua',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    name: 'Makanan',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3 0-6 2-6 5h12c0-3-3-5-6-5zM4 15h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    name: 'Minuman',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3h4M10 5h4M6 8l2 11h8l2-11H6z" />
      </svg>
    )
  },
  {
    name: 'Fashion',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4-2h6l4 2v4l-2 1v7H7v-7L5 12V8z" />
      </svg>
    )
  },
  {
    name: 'Aksesoris',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a4 4 0 00-4 4 4 4 0 108 0 4 4 0 00-4-4zM6 14h12l1 6H5l1-6z" />
      </svg>
    )
  },
  {
    name: 'Perlengkapan',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    name: 'Jasa',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'Lainnya',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
];

export default function ProductFilterBar({
  userUniversity = null,
  totalProducts = 0
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'Semua';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentRegion = searchParams.get('region') || 'Semua';
  const currentSearch = searchParams.get('search') || '';
  const isRoaming = searchParams.get('roaming') === 'true';

  const [searchInput, setSearchInput] = useState(currentSearch);
  const searchInputRef = useRef(null);

  // Helper to push updated parameters safely without wiping other active filters
  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (
        val === undefined ||
        val === null ||
        val === '' ||
        val === 'Semua' ||
        val === 'newest' ||
        (key === 'roaming' && val === false)
      ) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/products?${qs}` : '/products', { scroll: false });
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchInputRef.current?.blur();
    updateFilters({ search: searchInput.trim() });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilters({ search: '' });
  };

  const hasActiveFilters =
    currentCategory !== 'Semua' ||
    currentRegion !== 'Semua' ||
    currentSort !== 'newest' ||
    Boolean(currentSearch) ||
    isRoaming;

  const handleResetAll = () => {
    setSearchInput('');
    startTransition(() => {
      router.push('/products', { scroll: false });
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5 mb-8 transition-all">
      {/* ROW 1: Search + Select Dropdowns + Campus Switch */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pb-4 border-b border-gray-100">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari produk, toko, atau jasa di HIPMORA..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-gray-50/80 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:border-[#C62828] focus:ring-2 focus:ring-red-100 outline-none transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="Hapus pencarian"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>

        {/* Dropdowns & Campus Roaming Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Wilayah Dropdown */}
          <div className="flex-1 sm:flex-initial min-w-[140px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <select
              value={currentRegion}
              onChange={(e) => updateFilters({ region: e.target.value })}
              className="w-full pl-8 pr-7 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 focus:border-[#C62828] focus:ring-2 focus:ring-red-100 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="Semua">Semua Wilayah</option>
              <optgroup label="JABODETABEK">
                <option value="Jakarta">Jakarta</option>
                <option value="Kota Bogor">Kota Bogor</option>
                <option value="Kab. Bogor">Kab. Bogor</option>
                <option value="Kota Depok">Kota Depok</option>
                <option value="Kota Tangerang">Kota Tangerang</option>
                <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                <option value="Kab. Tangerang">Kab. Tangerang</option>
                <option value="Kota Bekasi">Kota Bekasi</option>
                <option value="Kab. Bekasi">Kab. Bekasi</option>
              </optgroup>
              <optgroup label="Jawa Barat">
                <option value="Kota Bandung">Kota Bandung</option>
                <option value="Kab. Bandung">Kab. Bandung</option>
                <option value="Kab. Bandung Barat">Kab. Bandung Barat</option>
                <option value="Kota Cimahi">Kota Cimahi</option>
                <option value="Kota Sukabumi">Kota Sukabumi</option>
                <option value="Kab. Sukabumi">Kab. Sukabumi</option>
                <option value="Kota Cirebon">Kota Cirebon</option>
                <option value="Kab. Cirebon">Kab. Cirebon</option>
                <option value="Kota Tasikmalaya">Kota Tasikmalaya</option>
                <option value="Kab. Tasikmalaya">Kab. Tasikmalaya</option>
                <option value="Kota Banjar">Kota Banjar</option>
                <option value="Kab. Ciamis">Kab. Ciamis</option>
                <option value="Kab. Cianjur">Kab. Cianjur</option>
                <option value="Kab. Garut">Kab. Garut</option>
                <option value="Kab. Indramayu">Kab. Indramayu</option>
                <option value="Kab. Karawang">Kab. Karawang</option>
                <option value="Kab. Kuningan">Kab. Kuningan</option>
                <option value="Kab. Majalengka">Kab. Majalengka</option>
                <option value="Kab. Pangandaran">Kab. Pangandaran</option>
                <option value="Kab. Purwakarta">Kab. Purwakarta</option>
                <option value="Kab. Subang">Kab. Subang</option>
                <option value="Kab. Sumedang">Kab. Sumedang</option>
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Urutkan Dropdown */}
          <div className="flex-1 sm:flex-initial min-w-[130px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full pl-8 pr-7 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 focus:border-[#C62828] focus:ring-2 focus:ring-red-100 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Unified Roaming / Campus Toggle (Only rendered if user has university) */}
          {userUniversity && (
            <button
              type="button"
              onClick={() => updateFilters({ roaming: !isRoaming })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isRoaming
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                  : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
              }`}
              title={isRoaming ? 'Mode Roaming: Menampilkan produk dari semua kampus' : `Khusus Kampus: Hanya produk mahasiswa ${userUniversity}`}
            >
              <span className="text-sm">{isRoaming ? '🌐' : '🎓'}</span>
              <span className="hidden sm:inline font-semibold">
                {isRoaming ? 'Semua Kampus' : 'Sekampus'}
              </span>
              <div
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                  isRoaming ? 'bg-amber-500' : 'bg-red-600'
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full bg-white transition-transform ${
                    isRoaming ? 'translate-x-3.5' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Horizontal Category Pills */}
      <div className="pt-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => updateFilters({ category: cat.name })}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#C62828] text-white shadow-xs font-semibold scale-[1.02]'
                    : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Results status & Active Filter Badges */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Menampilkan <strong className="text-gray-900 font-semibold">{totalProducts}</strong> produk
          </span>
          {userUniversity && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
              <span>{isRoaming ? '🌐 Seluruh Kampus' : `🎓 Mahasiswa ${userUniversity}`}</span>
            </span>
          )}
          {currentCategory !== 'Semua' && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-medium">
              Kategori: {currentCategory}
            </span>
          )}
          {currentRegion !== 'Semua' && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
              Wilayah: {currentRegion}
            </span>
          )}
          {currentSearch && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium">
              Cari: &ldquo;{currentSearch}&rdquo;
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline shrink-0 ml-2"
          >
            Reset Semua Filter
          </button>
        )}
      </div>
    </div>
  );
}
