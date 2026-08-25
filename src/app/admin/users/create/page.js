'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { REGIONS, UNIVERSITIES } from '@/lib/constants';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp: '',
    role: 'operator',
    isStudent: true,
    university: UNIVERSITIES[0],
    city: REGIONS[0],
    address: '',
    paymentMethods: []
  });

  const handleAddPaymentMethod = () => {
    setFormData({
      ...formData,
      paymentMethods: [...formData.paymentMethods, { provider: '', accountNumber: '', accountName: '', qrisImage: '' }]
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        // The API returns the user object directly, not wrapped in a { user: ... } object
        if (data._id) {
          setCurrentUser(data);
          if (data.role === 'operator') {
            setFormData(prev => ({ ...prev, role: 'tenant', university: data.university }));
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan akun');
      }

      setSuccess(`Berhasil! Akun ${data.user.email} telah dibuat.`);
      setTimeout(() => {
        router.push('/admin/users');
        router.refresh();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Tambah Pengguna Baru
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
                  placeholder="Budi Santoso"
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
                  placeholder="budi@example.com"
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
                  type="tel"
                  required={formData.role !== 'developer' && formData.role !== 'admin'}
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="0812..."
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {currentUser?.role === 'operator' ? (
              <div className="sm:col-span-6 border-t border-gray-900/10 pt-6 mt-2">
                <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-100">
                  <p className="font-semibold">Perhatian:</p>
                  <p>Anda sedang membuat akun Tenant yang akan otomatis terdaftar di kampus <strong>{currentUser.university}</strong>.</p>
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
                      {UNIVERSITIES.map((univ) => (
                        <option key={univ} value={univ}>{univ}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {(formData.role === 'operator' || formData.role === 'tenant' || formData.role === 'user') && (
              <>
                <div className="sm:col-span-4">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    Kota Domisili
                  </label>
                  <div className="mt-2">
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-4 flex items-center">
                  <input
                    id="isStudent"
                    name="isStudent"
                    type="checkbox"
                    checked={formData.isStudent}
                    onChange={(e) => setFormData({ ...formData, isStudent: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                  />
                  <label htmlFor="isStudent" className="ml-2 block text-sm font-medium leading-6 text-gray-900">
                    Berstatus Mahasiswa Aktif (Sembunyikan jika Tenant Umum/ROAM)
                  </label>
                </div>
              </>
            )}

            {/* Payment Methods for Tenant */}
            {formData.role === 'tenant' && (
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
                      <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => handleRemovePaymentMethod(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Bank / E-Wallet</label>
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
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Link/URL QRIS (Opsional)</label>
                          <input
                            type="url"
                            value={method.qrisImage || ''}
                            onChange={(e) => handlePaymentMethodChange(index, 'qrisImage', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                            placeholder="https://imgur.com/... (URL Gambar)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            {loading ? 'Menyimpan...' : 'Simpan Akun'}
          </button>
        </div>
      </form>
    </div>
  );
}
