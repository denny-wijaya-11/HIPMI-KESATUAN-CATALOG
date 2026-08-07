'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CompleteProfilePage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/google/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city }),
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
              <div className="mt-1">
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  placeholder="Misal: Bogor"
                  onChange={(e) => setCity(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Mulai Berbelanja"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
