export default function TenantProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-red-50 text-red-600 rounded-full p-4 mb-4">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Produk (Segera Hadir)</h1>
      <p className="text-gray-500 max-w-md">
        Fitur untuk menambahkan dan mengedit produk secara mandiri oleh penjual sedang dalam tahap pengembangan (Fase 2).
      </p>
    </div>
  );
}
