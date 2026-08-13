'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, cartCount, clearCart, isLoaded, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/user/sync')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setFormData(prev => ({
            ...prev,
            name: data.user.name || '',
            city: data.user.city || ''
          }));
        } else {
          router.push('/login?redirect=/checkout');
        }
      })
      .catch(() => {});
  }, [router]);

  const totalAmount = cart.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (cart.length === 0) {
      setError('Keranjang belanja Anda kosong.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity || 1,
            price: item.price,
            tenant: item.owner?._id || item.owner
          })),
          shippingAddress: formData
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses pesanan');

      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !user) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans">
      <header className="sticky top-0 z-50 bg-neutral-950/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="relative w-48 h-10 hover:opacity-80 transition-opacity">
              <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain object-left" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden sm:flex text-sm font-medium text-neutral-400 hover:text-white transition-colors items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </Link>
              <div className="text-sm font-semibold text-white px-3 py-1 bg-red-600/20 text-red-400 rounded-full border border-red-500/20">Checkout Aman</div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout Pesanan</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5">
            <h2 className="text-xl text-white mb-4">Keranjang Anda Kosong</h2>
            <button onClick={() => router.push('/products')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Alamat */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Informasi Pengiriman</h2>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1.5">Nama Penerima *</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1.5">Nomor Telepon / WA *</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">Alamat Lengkap *</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1.5">Kota / Kabupaten *</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1.5">Kode Pos *</label>
                      <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">Catatan Pesanan (Opsional)</label>
                    <input name="notes" value={formData.notes} onChange={handleInputChange} type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors" placeholder="Misal: Warna merah, ukuran L" />
                  </div>
                </form>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="space-y-6">
              <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-6">Ringkasan Pesanan</h2>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={`${item._id}-${idx}`} className="flex flex-col gap-3 pb-4 mb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex gap-4 items-start">
                        <div className="relative w-16 h-16 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                          <Image src={item.image || '/images/placeholder.png'} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                          <div className="text-sm font-semibold text-white mt-1">
                            Rp {Number(item.price).toLocaleString('id-ID')}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item._id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title="Hapus Produk"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center pl-20">
                        <div className="flex items-center gap-3 bg-neutral-800 rounded-lg px-2 py-1">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                            className="text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors w-6 h-6 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium text-white w-4 text-center">{item.quantity || 1}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="text-neutral-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-bold text-white">
                          Rp {(Number(item.price) * (item.quantity || 1)).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Total Harga ({cartCount} Barang)</span>
                    <span className="text-white">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Ongkos Kirim</span>
                    <span className="text-green-400 text-xs font-semibold px-2 py-0.5 bg-green-400/10 rounded">Menyusul</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-semibold text-white">Total Tagihan</span>
                    <span className="text-2xl font-bold text-red-500">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-amber-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Informasi Pembayaran
                  </h4>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    Pesanan Anda akan diteruskan langsung ke Penjual (Tenant) masing-masing. Pembayaran menggunakan metode Transfer Bank Manual. Instruksi akan diberikan setelah pesanan dibuat.
                  </p>
                </div>
                
                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : 'Buat Pesanan Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
