"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import AddToCartButton from "@/components/public/AddToCartButton";
import WishlistButton from "@/components/public/WishlistButton";
import CartIcon from "@/components/public/CartIcon";

export default function WishlistPage() {
  const { wishlist, isLoaded } = useWishlist();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30">
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
              <Link href="/" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative pb-1">Beranda</Link>
              <Link href="/products" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative pb-1">Produk</Link>
            </nav>
            <div className="flex items-center space-x-6">
              <CartIcon />
              <Link href="/login" className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full transition-all duration-300 hidden md:block border border-red-500">
                Login HIPMORA
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Produk Favorit</h1>
            <p className="text-neutral-400 max-w-xl text-lg">
              Daftar produk yang telah Anda simpan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-500">
                Belum ada produk favorit yang disimpan.
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product._id} className="group rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] hover:-translate-y-2 flex flex-col">
                  <div className="relative h-72 w-full bg-neutral-800 overflow-hidden">
                    <Link href={`/products/${product._id}`}>
                      <Image 
                        src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                        alt={product.name || 'Produk'} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 cursor-pointer" 
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent pointer-events-none" />
                    <div className="absolute top-5 right-5 flex flex-col items-end gap-2 pointer-events-none">
                      <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                        {product.category || 'Lainnya'}
                      </div>
                      {product.isFeatured && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300/30">
                          Unggulan 🔥
                        </div>
                      )}
                    </div>
                    <WishlistButton product={product} />
                  </div>
                  <div className="p-8 flex-1 flex flex-col relative -mt-6">
                    <div className="flex-1">
                      <p className="text-sm text-red-400 font-medium mb-2">{product.owner?.name || 'HIPMORA Tenant'}</p>
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors cursor-pointer">{product.name || 'Produk Tanpa Nama'}</h3>
                      </Link>
                      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">{product.description || '-'}</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 mb-1">Harga</span>
                        <span className="text-2xl font-bold text-white">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                      </div>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
