'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-neutral-900/50 border border-white/5 p-8 sm:p-12 rounded-3xl max-w-lg w-full">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Pesanan Berhasil!</h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          Terima kasih telah berbelanja di HIPMORA. Pesanan Anda telah diteruskan ke masing-masing Penjual (Tenant). Penjual akan segera menghubungi Anda untuk informasi pembayaran dan pengiriman.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
