'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Fashion', 'Aksesoris', 'Perlengkapan', 'Jasa', 'Lainnya'];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Semua';
  const currentSort = searchParams.get('sort') || 'newest';

  const updateFilters = (newCategory, newSort) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== 'Semua') {
      params.set('category', newCategory);
    }
    if (newSort && newSort !== 'newest') {
      params.set('sort', newSort);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products');
  };

  const handleCategoryClick = (category) => {
    updateFilters(category, currentSort);
  };

  const handleSortChange = (e) => {
    updateFilters(currentCategory, e.target.value);
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
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 scale-105'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-neutral-400 font-medium">Urutkan:</label>
        <select 
          id="sort"
          value={currentSort}
          onChange={handleSortChange}
          className="bg-neutral-900 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none transition-colors"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Termurah</option>
          <option value="price_desc">Termahal</option>
        </select>
      </div>
    </div>
  );
}
