'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const REGIONS = [
  'Kota Bogor',
  'Kabupaten Bogor',
  'Jakarta',
  'Depok',
  'Tangerang',
  'Bekasi',
  'Sukabumi',
  'Cianjur',
  'Lainnya'
];

const UNIVERSITIES = [
  'IBI Kesatuan (IBIK)',
  'Institut Pertanian Bogor (IPB)',
  'Universitas Pakuan (UNPAK)',
  'Universitas Djuanda (UNIDA)',
  'Universitas Terbuka (UT) Bogor',
  'Universitas Indonesia (UI)',
  'Institut Teknologi Bandung (ITB)',
  'Universitas Padjadjaran (UNPAD)',
  'Universitas Pendidikan Indonesia (UPI)',
  'Telkom University',
  'Universitas Trisakti',
  'Universitas Bina Nusantara (BINUS)',
  'Universitas Gunadarma',
  'UIN Syarif Hidayatullah Jakarta',
  'UIN Sunan Gunung Djati Bandung',
  'Lainnya'
];

export default function CompleteProfilePage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState(REGIONS[0]);
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [customUniversity, setCustomUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(true); // Automatically show on load as requested
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTermsAccepted) {
      setError('Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const finalUniversity = university === 'Lainnya' ? customUniversity : university;
      
      const res = await fetch('/api/auth/google/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, university: finalUniversity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan profil');
      }

      // Success, redirect to home
      router.push('/');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative w-48 h-32 flex items-center justify-center">
            <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Lengkapi Profil Anda
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tinggal satu langkah lagi untuk mulai berbelanja di HIPMORA
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-red-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  placeholder="Misal: Budi Santoso"
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Kota Asal
              </label>
              <div className="mt-1 relative">
                <select
                  id="city"
                  name="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors bg-white cursor-pointer"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-7 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                Universitas / Institut (UKM HIPMI PT)
              </label>
              <div className="mt-1 relative">
                <select
                  id="university"
                  name="university"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors bg-white cursor-pointer"
                >
                  {UNIVERSITIES.map((univ) => (
                    <option key={univ} value={univ}>
                      {univ}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {university === 'Lainnya' && (
              <div>
                <label htmlFor="customUniversity" className="block text-sm font-medium text-gray-700">
                  Sebutkan Universitas / Institut Anda
                </label>
                <div className="mt-1">
                  <input
                    id="customUniversity"
                    name="customUniversity"
                    type="text"
                    required
                    value={customUniversity}
                    placeholder="Ketik nama kampus Anda..."
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors bg-white"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                  Saya menyetujui{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#C62828] hover:underline font-bold">
                    Syarat & Ketentuan
                  </button>
                </label>
                <p className="text-gray-500 text-xs mt-1">Anda harus menyetujui S&K untuk membuat akun.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isTermsAccepted}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#C62828] hover:bg-[#8E0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Mulai Berbelanja"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* S&K Modal Pop-up */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Syarat & Ketentuan HIPMORA</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
                <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                  <h4 className="text-base font-bold text-[#C62828] mb-3">Ketentuan Gambar Produk (Untuk Tenant)</h4>
                  <ol className="list-decimal pl-5 space-y-2 font-medium text-gray-800">
                    <li>Ukuran gambar produk yakni <strong>1:1</strong> (Persegi).</li>
                    <li>Format gambar produk direkomendasikan dengan format <strong>.webp</strong>.</li>
                    <li>Background gambar produk <strong>wajib</strong> menggunakan warna dengan kode <span className="inline-block px-1.5 py-0.5 bg-[#b6b09f] text-white rounded text-xs">#b6b09f</span>.</li>
                    <li>Gambar <strong>tidak boleh</strong> mengandung unsur negatif (SARA, Rasisme, dll.)</li>
                    <li><strong>Tidak boleh</strong> mencantumkan produk/jasa ilegal (Obat-obatan terlarang, dll.)</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2 mt-4">Persetujuan Pengguna</h4>
                  <p>Dengan membuat akun di HIPMORA Kesatuan, Anda setuju untuk mematuhi semua peraturan dan kebijakan yang berlaku baik sebagai pembeli maupun penjual (tenant).</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] shadow-sm transition-colors"
              >
                Saya Setuju (I Accept)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
