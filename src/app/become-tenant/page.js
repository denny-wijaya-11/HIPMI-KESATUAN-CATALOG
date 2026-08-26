'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BecomeTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    paymentMethods: []
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          
          if (data.role !== 'user') {
            setError('Anda sudah menjadi Tenant atau Admin.');
          } else if (data.tenantStatus === 'pending') {
            setError('Pengajuan Anda sedang diproses oleh Admin. Harap bersabar.');
          }
          
          setFormData({
            address: data.address || '',
            paymentMethods: data.paymentMethods || []
          });
        } else {
          router.push('/login?callbackUrl=/become-tenant');
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Gagal memuat data profil');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (formData.paymentMethods.length === 0) {
      setError('Minimal tambahkan 1 metode pembayaran untuk transaksi pembeli.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/become-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pengajuan');
      }

      setSuccess('Pengajuan berhasil dikirim! Mohon tunggu konfirmasi dari Admin.');
      setUser({ ...user, tenantStatus: 'pending' });
      
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

  const isFormDisabled = saving || (user?.role !== 'user') || (user?.tenantStatus === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-xl mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-xl font-bold leading-6 text-gray-900">Formulir Pendaftaran Tenant</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Lengkapi data bisnis Anda untuk mulai berjualan di platform HIPMORA.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Alamat Lengkap Toko / Bisnis
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    disabled={isFormDisabled}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Masukkan alamat lengkap operasional bisnis Anda..."
                  />
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Metode Pembayaran</h4>
                    <p className="text-sm text-gray-500">Rekening atau E-Wallet yang akan ditampilkan ke pembeli saat checkout.</p>
                  </div>
                  {!isFormDisabled && (
                    <button
                      type="button"
                      onClick={handleAddPaymentMethod}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      + Tambah Rekening
                    </button>
                  )}
                </div>

                {formData.paymentMethods.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">Belum ada metode pembayaran yang ditambahkan.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                        {!isFormDisabled && (
                          <button
                            type="button"
                            onClick={() => handleRemovePaymentMethod(index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Bank / E-Wallet</label>
                            <input
                              type="text"
                              required
                              disabled={isFormDisabled}
                              value={method.provider}
                              onChange={(e) => handlePaymentMethodChange(index, 'provider', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                              placeholder="BCA"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Rekening / HP</label>
                            <input
                              type="text"
                              required
                              disabled={isFormDisabled}
                              value={method.accountNumber}
                              onChange={(e) => handlePaymentMethodChange(index, 'accountNumber', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                              placeholder="1234567890"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Atas Nama (A/N)</label>
                            <input
                              type="text"
                              required
                              disabled={isFormDisabled}
                              value={method.accountName}
                              onChange={(e) => handlePaymentMethodChange(index, 'accountName', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                              placeholder="Budi Santoso"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Link/URL QRIS (Opsional)</label>
                          <input
                            type="url"
                            disabled={isFormDisabled}
                            value={method.qrisImage || ''}
                            onChange={(e) => handlePaymentMethodChange(index, 'qrisImage', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="https://imgur.com/... (URL Gambar)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
              {!error && user?.tenantStatus !== 'pending' && user?.role === 'user' && (
                <button
                  type="submit"
                  disabled={saving || isFormDisabled}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {saving ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
