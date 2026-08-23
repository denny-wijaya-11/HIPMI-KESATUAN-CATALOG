'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Fashion', 'Aksesoris', 'Perlengkapan', 'Jasa', 'Lainnya'];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Semua';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentRegion = searchParams.get('region') || 'Semua';

  const updateFilters = (newCategory, newSort, newRegion) => {
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
    
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products');
  };

  const handleCategoryClick = (category) => {
    updateFilters(category, currentSort, currentRegion);
  };

  const handleSortChange = (e) => {
    updateFilters(currentCategory, e.target.value, currentRegion);
  };

  const handleRegionChange = (e) => {
    updateFilters(currentCategory, currentSort, e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => {
          const isActive = currentCategory === category;
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-[#C62828] text-white shadow-md border border-[#C62828]'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {category}
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
  );
}
