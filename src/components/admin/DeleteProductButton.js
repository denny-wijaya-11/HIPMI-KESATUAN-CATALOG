'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus produk');
      }

      alert('Produk berhasil dihapus');
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
