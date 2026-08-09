'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/public/CartIcon';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, isLoaded } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [waLink, setWaLink] = useState('');

  // Auto-select all items initially when loaded
  useEffect(() => {
    if (isLoaded) {
      setSelectedItems(cart.map(item => item._id));
    }
  }, [isLoaded, cart.length]);

  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item._id));
    }
  };

  const calculateTotal = () => {
    return cart
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    setIsCheckingOut(true);
    
    // Generate WA message
    const checkoutItems = cart.filter(item => selectedItems.includes(item._id));
    const total = calculateTotal();
    
    let message = `Halo Admin HIPMORA, saya ingin memesan barang berikut:%0A%0A`;
    checkoutItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}%0A`;
    });
    message += `%0ATotal Bayar: *Rp ${total.toLocaleString('id-ID')}*%0A%0ABerikut saya lampirkan bukti pembayaran QRIS saya.`;
    
    // Ganti nomor WA di sini
    const adminPhone = '6281234567890'; 
    setWaLink(`https://wa.me/${adminPhone}?text=${message}`);

    setTimeout(() => {
      setIsCheckingOut(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0,transparent_50%)] animate-pulse" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-950/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">
            <div className="flex items-center group cursor-pointer h-full py-2">
              <Link href="/">
                <div className="relative w-64 h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 256px" />
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="/" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Beranda</Link>
              <Link href="/products" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Produk</Link>
            </nav>
            <div className="flex items-center space-x-6">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">Keranjang Anda kosong</h2>
            <p className="text-neutral-500 mb-6">Ayo temukan produk menarik di katalog kami!</p>
            <Link href="/products" className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === cart.length && cart.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                  <span className="font-medium text-white">Pilih Semua ({cart.length})</span>
                </div>
                <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300">
                  Hapus Semua
                </button>
              </div>

              {cart.map((item) => (
                <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                    <Image 
                      src={item.image || '/images/placeholder.png'} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 mb-1">{item.ownerName || 'Kategori'}</p>
                    <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-red-400 font-bold mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50"
                    >-</button>
                    <span className="w-6 text-center font-medium text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-36">
                <h3 className="text-xl font-bold text-white mb-6">Ringkasan Belanja</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-400">
                    <span>Total Harga ({selectedItems.length} barang)</span>
                    <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Biaya Layanan</span>
                    <span>Rp 0</span>
                  </div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Tagihan</span>
                    <span className="text-red-400">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || isCheckingOut}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  {isCheckingOut ? 'Memproses...' : 'Beli Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Modal Simulation */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center animate-in zoom-in duration-300 my-8">
            <h2 className="text-2xl font-bold text-white mb-2">Selesaikan Pembayaran</h2>
            <p className="text-neutral-400 mb-6 text-sm">Silakan scan QRIS di bawah ini menggunakan aplikasi M-Banking atau e-Wallet pilihan Anda.</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl relative w-64 h-64 mx-auto">
              <Image 
                src="/images/QRIS BAYAR.jpeg" 
                alt="QRIS HIPMORA" 
                fill
                className="object-contain rounded-xl p-2"
              />
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
              <p className="text-sm text-neutral-400 mb-1">Total Tagihan:</p>
              <p className="text-2xl font-bold text-red-400">Rp {calculateTotal().toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-3">
              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Hapus item dari cart setelah klik tombol WA
                  selectedItems.forEach(id => removeFromCart(id));
                  setSelectedItems([]);
                  setShowSuccessModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-green-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Kirim Bukti via WhatsApp
              </a>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
