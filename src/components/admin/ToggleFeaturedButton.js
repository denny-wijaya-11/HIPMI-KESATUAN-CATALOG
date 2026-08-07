'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToggleFeaturedButton({ productId, initialIsFeatured }) {
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured || false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleFeatured = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengubah status');
      }

      setIsFeatured(!isFeatured);
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFeatured}
      disabled={isLoading}
      title={isFeatured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
      className={`p-1.5 rounded-full transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isFeatured ? "currentColor" : "none"} 
        stroke="currentColor" 
        className={`w-6 h-6 ${isFeatured ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    </button>
  );
}
