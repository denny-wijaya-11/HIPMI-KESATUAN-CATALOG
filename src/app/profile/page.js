/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    city: '',
    address: '',
    university: ''
  });

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          avatar: data.avatar || '',
          city: data.city || '',
          address: data.address || '',
          university: data.university || ''
        });
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setError('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan profil');
      }

      setSuccess('Profil berhasil diperbarui!');
      // Update local state to reflect changes immediately
      setUser({ ...user, ...data.user });
      
      // Force refresh router to update nav menu
      router.refresh();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-xl mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-xl font-bold leading-6 text-gray-900">Profil Saya</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Perbarui identitas dan foto profil Anda di sini.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              
              {/* Foto Profil Preview */}
              <div className="sm:col-span-6 flex items-center gap-6">
                <div className="shrink-0">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview Avatar" className="h-24 w-24 object-cover rounded-full border-2 border-gray-200 shadow-sm" />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-sm">
                      <span className="text-3xl font-bold text-gray-500">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                    URL Foto Profil
                  </label>
                  <div className="mt-2">
                    <input
                      type="url"
                      name="avatar"
                      id="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                      placeholder="https://contoh.com/foto-saya.jpg"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Gunakan link gambar publik atau link Google Drive.</p>
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6"></div>

              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-gray-400 text-xs font-normal">(Tidak dapat diubah)</span>
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    disabled
                    value={user?.email || ''}
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2 border text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Tampilkan kolom tambahan berdasarkan role atau tipe user jika diperlukan */}
              {(user?.role === 'tenant' || user?.role === 'operator') && !user?.isStudent && (
                <>
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Alamat Lengkap
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                  </div>
                </>
              )}

            </div>

            {error && (
              <div className="mt-6 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-6 px-4 py-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-100">
                {success}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <Link
                href="/"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
