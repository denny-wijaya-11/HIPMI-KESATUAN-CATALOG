'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center text-center px-4 font-sans">
      <div className="bg-white border border-gray-100 shadow-sm p-8 sm:p-12 rounded-2xl max-w-lg w-full">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pesanan Berhasil!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Terima kasih telah berbelanja di HIPMORA. Pesanan Anda telah diteruskan ke masing-masing Penjual (Tenant). Penjual akan segera menghubungi Anda untuk informasi pembayaran dan pengiriman.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#C62828] hover:bg-[#8E0000] text-white text-sm font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
