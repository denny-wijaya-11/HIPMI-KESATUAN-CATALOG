'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelOrderButton({ orderId }) {
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    setIsCanceling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });

      const data = await res.json();
      if (res.ok) {
        alert('Pesanan berhasil dibatalkan.');
        router.refresh();
      } else {
        alert(data.error || 'Gagal membatalkan pesanan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat membatalkan pesanan.');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCanceling}
      className="inline-flex justify-center items-center bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isCanceling ? 'Membatalkan...' : 'Batalkan Pesanan'}
    </button>
  );
}
