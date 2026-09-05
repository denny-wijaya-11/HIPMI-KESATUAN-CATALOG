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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedItems(cart.map(item => item.cartItemId || item._id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setSelectedItems(cart.map(item => item.cartItemId || item._id));
    }
  };

  const calculateTotal = () => {
    return cart
      .filter(item => selectedItems.includes(item.cartItemId || item._id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    setIsCheckingOut(true);
    
    // Generate WA message
    const checkoutItems = cart.filter(item => selectedItems.includes(item.cartItemId || item._id));
    const total = calculateTotal();
    
    let message = `Halo Admin HIPMORA, saya ingin memesan barang berikut:%0A%0A`;
    checkoutItems.forEach((item, index) => {
      const variantText = item.selectedVariantName ? ` [${item.selectedVariantName}]` : '';
      message += `${index + 1}. ${item.name}${variantText} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}%0A`;
    });
    message += `%0ATotal Bayar: *Rp ${total.toLocaleString('id-ID')}*%0A%0ABerikut saya lampirkan bukti pembayaran QRIS saya.`;
    
    // Ganti nomor WA di sini
    const adminPhone = '6285122961923'; 
    setWaLink(`https://wa.me/${adminPhone}?text=${message}`);

    setTimeout(() => {
      setIsCheckingOut(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center text-gray-500">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center h-full py-2">
              <Link href="/">
                <div className="relative w-32 md:w-48 h-full min-h-[40px] flex items-center justify-center">
                  <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" priority sizes="(max-width: 768px) 128px, 192px" />
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#C62828] transition-colors">Beranda</Link>
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-[#C62828] transition-colors">Produk</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Anda kosong</h2>
            <p className="text-gray-400 text-sm mb-6">Ayo temukan produk menarik di katalog kami!</p>
            <Link href="/products" className="bg-[#C62828] text-white px-6 py-2.5 rounded-full hover:bg-[#8E0000] transition-colors text-sm font-semibold">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === cart.length && cart.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#C62828] focus:ring-[#C62828] cursor-pointer"
                  />
                  <span className="font-medium text-gray-900 text-sm">Pilih Semua ({cart.length})</span>
                </div>
                <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
                  Hapus Semua
                </button>
              </div>

              {cart.map((item) => {
                const keyId = item.cartItemId || item._id;
                return (
                <div key={keyId} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(keyId)}
                    onChange={() => toggleSelect(keyId)}
                    className="w-4 h-4 rounded border-gray-300 text-[#C62828] focus:ring-[#C62828] cursor-pointer"
                  />
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image 
                      src={item.image || '/images/placeholder.png'} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{item.ownerName || 'Kategori'}</p>
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.name} 
                      {item.selectedVariantName && <span className="text-[#C62828] font-normal ml-1">[{item.selectedVariantName}]</span>}
                    </h3>
                    <p className="text-[#C62828] font-bold text-sm mt-0.5">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(keyId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 text-sm"
                    >-</button>
                    <span className="w-5 text-center font-medium text-gray-900 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(keyId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    >+</button>
                    <button 
                      onClick={() => removeFromCart(keyId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 text-sm ml-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )})}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Total Harga ({selectedItems.length} barang)</span>
                    <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Biaya Layanan</span>
                    <span>Rp 0</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-gray-900 font-bold text-base">
                    <span>Total Tagihan</span>
                    <span className="text-[#C62828]">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || isCheckingOut}
                  className="w-full bg-[#C62828] text-white font-semibold py-3 rounded-xl hover:bg-[#8E0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm text-sm"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl max-w-md w-full text-center shadow-xl my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Selesaikan Pembayaran</h2>
            <p className="text-gray-500 mb-5 text-sm">Silakan scan QRIS di bawah ini menggunakan aplikasi M-Banking atau e-Wallet pilihan Anda.</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl relative w-64 h-64 mx-auto">
              <Image 
                src="/images/QRIS BAYAR TEST.png" 
                alt="QRIS HIPMORA" 
                fill
                className="object-contain rounded-xl p-2"
              />
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Total Tagihan:</p>
              <p className="text-2xl font-bold text-[#C62828]">Rp {calculateTotal().toLocaleString('id-ID')}</p>
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
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
