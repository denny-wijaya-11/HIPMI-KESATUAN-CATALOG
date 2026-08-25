'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/constants';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator',
    whatsapp: '',
    university: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat pengguna');
        }
        
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          role: data.user.role || 'operator',
          whatsapp: data.user.whatsapp || '',
          university: data.user.university || ''
        });

        // Also fetch current user profile
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        // The API returns the user object directly
        if (profileData._id) {
          setCurrentUser(profileData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah pengguna');
      }

      setSuccess('Pengguna berhasil diperbarui!');
      setTimeout(() => {
        router.push('/admin/users');
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Memuat data pengguna...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Pengguna
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/users"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Batal
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Alamat Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="whatsapp" className="block text-sm font-medium leading-6 text-gray-900">
                Nomor WhatsApp
              </label>
              <div className="mt-2">
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            {currentUser?.role === 'operator' ? (
              <div className="sm:col-span-6 border-t border-gray-900/10 pt-6 mt-2">
                <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-100">
                  <p className="font-semibold">Perhatian:</p>
                  <p>Anda hanya diizinkan untuk mengubah nama dan email dari akun Tenant ini.</p>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                  Peran (Role)
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                  >
                    <option value="operator">Operator (Admin Kampus)</option>
                    <option value="tenant">Tenant (Penjual)</option>
                    <option value="admin">Admin Pusat</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
              </div>
            )}

            {currentUser?.role !== 'operator' && (formData.role === 'operator' || formData.role === 'tenant') && (
              <>
                <div className="sm:col-span-6 border-t border-gray-900/10 pt-6 mt-2">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Detail Kampus</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Pilih kampus untuk {formData.role === 'operator' ? 'operator' : 'tenant'} ini.
                  </p>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="university" className="block text-sm font-medium leading-6 text-gray-900">
                    Pilih Universitas
                  </label>
                  <div className="mt-2">
                    <select
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                    >
                      <option value="">Pilih Kampus...</option>
                      {UNIVERSITIES.map((univ) => (
                        <option key={univ} value={univ}>{univ}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
        
        {error && (
          <div className="px-4 sm:px-8 py-3 bg-red-50 text-red-700 text-sm border-t border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="px-4 sm:px-8 py-3 bg-green-50 text-green-700 text-sm border-t border-green-100">
            {success}
          </div>
        )}

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
