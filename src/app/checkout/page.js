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
    
    // Simulate API call for payment gateway
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowSuccessModal(true);
      // Remove checked out items from cart
      selectedItems.forEach(id => removeFromCart(id));
      setSelectedItems([]);
    }, 1500);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Pesanan Berhasil!</h2>
            <p className="text-neutral-400 mb-8">Terima kasih telah berbelanja. Anda akan segera diarahkan ke halaman pembayaran atau instruksi selanjutnya.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
