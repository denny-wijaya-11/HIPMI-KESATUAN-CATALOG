/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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
    university: '',
    paymentMethods: []
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
          university: data.university || '',
          paymentMethods: data.paymentMethods || []
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

  const handleAddPaymentMethod = () => {
    setFormData({
      ...formData,
      paymentMethods: [...formData.paymentMethods, { provider: '', accountNumber: '', accountName: '' }]
    });
  };

  const handleRemovePaymentMethod = (index) => {
    const newMethods = [...formData.paymentMethods];
    newMethods.splice(index, 1);
    setFormData({ ...formData, paymentMethods: newMethods });
  };

  const handlePaymentMethodChange = (index, field, value) => {
    const newMethods = [...formData.paymentMethods];
    newMethods[index][field] = value;
    setFormData({ ...formData, paymentMethods: newMethods });
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

  const handleLogout = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar?')) return;
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('hipmora_cart');
        localStorage.removeItem('hipmora_wishlist');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Logout failed', err);
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
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  
                  {/* Camera Button (Hanya terlihat jika di HP / mendukung Capacitor) */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const image = await Camera.getPhoto({
                          quality: 80,
                          width: 400,
                          allowEditing: true,
                          resultType: CameraResultType.DataUrl,
                          source: CameraSource.Prompt
                        });
                        if (image.dataUrl) {
                          setFormData({ ...formData, avatar: image.dataUrl });
                        }
                      } catch (e) {
                        console.error('Kamera dibatalkan atau error', e);
                      }
                    }}
                    className="mb-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ambil Foto / Galeri
                  </button>

                  <div className="mt-1">
                    <input
                      type="url"
                      name="avatar"
                      id="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                      placeholder="Atau paste URL gambar di sini..."
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Anda dapat memotret langsung atau menggunakan URL gambar (termasuk Data URL Base64).</p>
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

              <div className="sm:col-span-6">
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                  Nomor WhatsApp <span className="text-gray-400 text-xs font-normal">(Hubungi Admin untuk mengubah)</span>
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="whatsapp"
                    id="whatsapp"
                    disabled
                    value={user?.whatsapp || ''}
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

              {/* Payment Methods for Tenant */}
              {user?.role === 'tenant' && (
                <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Metode Pembayaran</h4>
                      <p className="text-sm text-gray-500">Rekening atau E-Wallet yang akan ditampilkan ke pembeli saat checkout.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPaymentMethod}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      + Tambah Rekening
                    </button>
                  </div>

                  {formData.paymentMethods.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">Belum ada metode pembayaran yang ditambahkan.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.paymentMethods.map((method, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                          <button
                            type="button"
                            onClick={() => handleRemovePaymentMethod(index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                          
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Bank / E-Wallet (mis. BCA, GoPay)</label>
                            <input
                              type="text"
                              required
                              value={method.provider}
                              onChange={(e) => handlePaymentMethodChange(index, 'provider', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                              placeholder="BCA"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Rekening / HP</label>
                            <input
                              type="text"
                              required
                              value={method.accountNumber}
                              onChange={(e) => handlePaymentMethodChange(index, 'accountNumber', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                              placeholder="1234567890"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Atas Nama (A/N)</label>
                            <input
                              type="text"
                              required
                              value={method.accountName}
                              onChange={(e) => handlePaymentMethodChange(index, 'accountName', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                              placeholder="Budi Santoso"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex justify-center items-center py-2 px-4 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar dari Akun
              </button>
              
              <div className="flex w-full sm:w-auto gap-3">
                <Link
                  href="/"
                  className="flex-1 sm:flex-none inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Kembali
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
