"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import AddToCartButton from "@/components/public/AddToCartButton";
import WishlistButton from "@/components/public/WishlistButton";
import CartIcon from "@/components/public/CartIcon";
import WishlistNavIcon from "@/components/public/WishlistNavIcon";
import UserNavMenu from "@/components/public/UserNavMenu";
import PublicHeader from "@/components/public/PublicHeader";
import { getUserPayload } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const { wishlist, isLoaded } = useWishlist();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const payload = await getUserPayload();
      setUser(payload);
    };
    fetchUser();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center text-gray-500">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      {/* Navbar */}
      <PublicHeader user={user} />

      <main className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Produk Favorit</h1>
            <p className="text-gray-500 max-w-xl text-lg">
              Daftar produk yang telah Anda simpan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                Belum ada produk favorit yang disimpan.
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative h-48 md:h-64 w-full bg-gray-50 overflow-hidden">
                    <Link href={`/products/${product._id}`}>
                      <Image 
                        src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                        alt={product.name || 'Produk'} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                      />
                    </Link>
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] md:text-xs font-medium text-gray-700 shadow-sm">
                        {product.category || 'Lainnya'}
                      </span>
                      {product.isFeatured && (
                        <span className="bg-amber-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold text-amber-900 shadow-sm">
                          ⭐ Unggulan
                        </span>
                      )}
                    </div>
                    <WishlistButton product={product} />
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <p className="text-xs md:text-sm text-gray-400 font-medium">{product.owner?.name || 'HIPMORA Tenant'}</p>
                        {product.region && (
                          <span className="flex items-center text-xs text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {product.region}
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#C62828] transition-colors cursor-pointer">{product.name || 'Produk Tanpa Nama'}</h3>
                      </Link>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{product.description || '-'}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-0.5">Harga</span>
                        <span className="text-lg md:text-xl font-bold text-[#C62828]">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
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
