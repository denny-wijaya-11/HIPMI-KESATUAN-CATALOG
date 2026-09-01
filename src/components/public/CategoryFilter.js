'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  {
    name: 'Semua',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  },
  {
    name: 'Makanan',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3 0-6 2-6 5h12c0-3-3-5-6-5zM4 15h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>
  },
  {
    name: 'Minuman',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3h4M10 5h4M6 8l2 11h8l2-11H6z" /></svg>
  },
  {
    name: 'Fashion',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4-2h6l4 2v4l-2 1v7H7v-7L5 12V8z" /></svg>
  },
  {
    name: 'Aksesoris',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a4 4 0 00-4 4 4 4 0 108 0 4 4 0 00-4-4zM6 14h12l1 6H5l1-6z" /></svg>
  },
  {
    name: 'Perlengkapan',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  },
  {
    name: 'Jasa',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  {
    name: 'Lainnya',
    icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
  }
];

export default function CategoryFilter({ userUniversity }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Semua';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentRegion = searchParams.get('region') || 'Semua';
  const isSatuKampus = searchParams.get('satuKampus') === 'true';

  const updateFilters = (newCategory, newSort, newRegion, newSatuKampus) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== 'Semua') {
      params.set('category', newCategory);
    }
    if (newSort && newSort !== 'newest') {
      params.set('sort', newSort);
    }
    if (newRegion && newRegion !== 'Semua') {
      params.set('region', newRegion);
    }
    if (newSatuKampus) {
      params.set('satuKampus', 'true');
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products');
  };

  const handleCategoryClick = (category) => {
    updateFilters(category, currentSort, currentRegion, isSatuKampus);
  };

  const handleSortChange = (e) => {
    updateFilters(currentCategory, e.target.value, currentRegion, isSatuKampus);
  };

  const handleRegionChange = (e) => {
    updateFilters(currentCategory, currentSort, e.target.value, isSatuKampus);
  };

  const handleSatuKampusToggle = () => {
    updateFilters(currentCategory, currentSort, currentRegion, !isSatuKampus);
  };

  return (
    <div className="flex flex-col mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {CATEGORIES.map((catObj) => {
            const isActive = currentCategory === catObj.name;
            return (
              <button
                key={catObj.name}
                onClick={() => handleCategoryClick(catObj.name)}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#C62828] text-white shadow-md border border-[#C62828]'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {catObj.icon}
                <span>{catObj.name}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-6 sm:mt-0">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <label htmlFor="region" className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">Wilayah:</label>
            <select 
              id="region"
              value={currentRegion}
              onChange={handleRegionChange}
              className="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg focus:ring-[#C62828] focus:border-[#C62828] block p-2 outline-none transition-colors w-full sm:w-auto min-w-[140px]"
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
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2">
            <label htmlFor="sort" className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">Urutkan:</label>
            <select 
              id="sort"
              value={currentSort}
              onChange={handleSortChange}
              className="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg focus:ring-[#C62828] focus:border-[#C62828] block p-2 outline-none transition-colors w-full sm:w-auto min-w-[120px]"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Termurah</option>
              <option value="price_desc">Termahal</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Social Filter / Satu Kampus Toggle */}
      {userUniversity && (
        <div className="mt-5 flex items-center justify-between sm:justify-start bg-red-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-red-100 sm:border-none">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-1.5 rounded-full text-[#C62828]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-800">Dukung Teman Sekampus</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Tampilkan produk mahasiswa {userUniversity}</span>
            </div>
          </div>
          
          <button 
            onClick={handleSatuKampusToggle}
            className={`ml-4 sm:ml-6 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2 ${
              isSatuKampus ? 'bg-[#C62828]' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isSatuKampus}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isSatuKampus ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
