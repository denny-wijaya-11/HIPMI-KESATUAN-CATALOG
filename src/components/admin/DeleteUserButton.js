'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteUserButton({ userId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini secara permanen?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus pengguna');
      }

      alert('Pengguna berhasil dihapus');
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
