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
    storeName: '',
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
            setError('Pengajuan Anda sedang menunggu pembayaran. Silakan selesaikan pembayaran ke rekening Admin.');
          } else if (data.tenantStatus === 'paid') {
            setError('Pembayaran Anda telah lunas! Pengajuan sedang diproses oleh Operator. Harap bersabar.');
          }
          
          setFormData({
            storeName: data.name || '',
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

    if (!formData.storeName) {
      setError('Nama Toko wajib diisi.');
      setSaving(false);
      return;
    }

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

      setSuccess('Pengajuan berhasil! Silakan selesaikan pembayaran.');
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

  const isFormDisabled = saving || (user?.role !== 'user') || (user?.tenantStatus === 'pending' || user?.tenantStatus === 'paid');

  let waUrl = '';
  if (user?.tenantStatus === 'pending') {
    const waText = `Halo Admin, saya telah melakukan pembayaran sewa Tenant. Berikut data saya:
Nama Lengkap: ${user?.name || '-'}
Nama Toko: ${formData.storeName || '-'}
Domisili: ${formData.address || '-'}
Universitas: ${user?.university || '-'}
Membayar dari Bank/E-Wallet: ${formData.paymentMethods?.[0]?.provider || '-'}

Mohon segera dikonfirmasi!`;
    waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || ''}?text=${encodeURIComponent(waText)}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-xl mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-xl font-bold leading-6 text-gray-900">Formulir Pendaftaran Tenant</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Lengkapi data bisnis Anda untuk mulai berjualan di platform HIPMORA.
            </p>
            {user?.isStudent && user?.university && (
              <div className="mt-3 p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100">
                🎓 Anda akan mendaftar sebagai tenant di kampus <strong>{user.university}</strong>.
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              
              <div className="sm:col-span-6">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Nama Toko / Bisnis
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    required
                    disabled={isFormDisabled}
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Contoh: Ayam Geprek Budi"
                  />
                  <p className="mt-1 text-xs text-gray-500">Ini akan mengganti nama profil Anda dengan nama toko.</p>
                </div>
              </div>

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

            {user?.tenantStatus === 'pending' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-bold text-yellow-800 mb-2">Instruksi Pembayaran</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  Silakan selesaikan pembayaran sewa <strong>Promo Bulan Pertama sebesar Rp 100.000</strong> ke rekening berikut untuk mengaktifkan akun toko Anda:
                </p>
                <div className="bg-white p-3 rounded border border-yellow-100 mb-2">
                  <p className="font-mono text-gray-900 font-bold">{process.env.NEXT_PUBLIC_ADMIN_BANK_ACCOUNT || 'Hubungi Admin untuk No. Rekening'}</p>
                  <p className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_ADMIN_BANK_NAME ? `a/n ${process.env.NEXT_PUBLIC_ADMIN_BANK_NAME}` : ''}</p>
                </div>
                <p className="text-sm text-yellow-700">
                  Setelah transfer, klik tautan ini untuk <a href={waUrl} className="underline font-medium hover:text-yellow-900" target="_blank" rel="noopener noreferrer">Mengirim Bukti Transfer via WhatsApp</a>.
                </p>
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
