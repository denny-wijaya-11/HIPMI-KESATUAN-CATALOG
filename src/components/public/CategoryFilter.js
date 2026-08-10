'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Fashion', 'Aksesoris', 'Perlengkapan', 'Jasa', 'Lainnya'];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Semua';

  const handleCategoryClick = (category) => {
    if (category === 'Semua') {
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-10">
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
  );
}
