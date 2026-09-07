'use client';

export default function ChatError({ error, reset }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-gray-500 mb-6">Halaman chat tidak bisa dimuat. Coba muat ulang halaman.</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-[#C62828] text-white rounded-full text-sm font-medium hover:bg-[#8E0000] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
