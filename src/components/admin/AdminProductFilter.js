"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AdminProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentRegion = searchParams.get('region') || 'Semua';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const updateFilters = (newRegion, newSort) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (newRegion && newRegion !== 'Semua') params.set('region', newRegion);
    if (newSort && newSort !== 'newest') params.set('sort', newSort);
    
    const queryString = params.toString();
    router.push(queryString ? `/admin/products?${queryString}` : '/admin/products');
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="admin-region" className="text-sm font-medium text-gray-700 whitespace-nowrap">Wilayah:</label>
        <select 
          id="admin-region"
          value={currentRegion}
          onChange={(e) => updateFilters(e.target.value, currentSort)}
          className="block w-full sm:w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
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

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="admin-sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">Urutkan Harga:</label>
        <select 
          id="admin-sort"
          value={currentSort}
          onChange={(e) => updateFilters(currentRegion, e.target.value)}
          className="block w-full sm:w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Termurah (Rendah - Tinggi)</option>
          <option value="price_desc">Termahal (Tinggi - Rendah)</option>
        </select>
      </div>
    </div>
  );
}
