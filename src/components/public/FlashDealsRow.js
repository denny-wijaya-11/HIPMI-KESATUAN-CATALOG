'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/public/AddToCartButton';

export default function FlashDealsRow({ products = [] }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  // Filter or take products for deal section
  const dealProducts = products.length > 0 ? products.slice(0, 4) : [];

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#C62828] to-[#991B1B] rounded-2xl p-4 sm:p-6 text-white shadow-md">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-xs">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Flash Deals Mahasiswa</h3>
                  <span className="bg-amber-400 text-amber-950 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Hari Ini
                  </span>
                </div>
                <p className="text-xs text-red-100">Diskon spesial ramah kantong dari tenant kampus</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-red-200 hidden sm:inline">Berakhir dalam:</span>
              <div className="flex items-center gap-1 text-xs font-bold">
                <span className="bg-black/40 px-2 py-1 rounded-md">{formatDigit(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-black/40 px-2 py-1 rounded-md">{formatDigit(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-black/40 px-2 py-1 rounded-md">{formatDigit(timeLeft.seconds)}</span>
              </div>
              <Link
                href="/products"
                className="ml-3 text-xs font-bold text-white hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {dealProducts.map((p) => {
              const hasDiscount = p.originalPrice > p.price;
              const discountPercent = hasDiscount
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 15;

              return (
                <div
                  key={p._id.toString()}
                  className="bg-white rounded-xl overflow-hidden flex flex-col justify-between text-gray-800 shadow-xs hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                    <Link href={`/products/${p._id}`}>
                      <Image
                        src={
                          p.images && p.images.length > 0
                            ? p.images[0]
                            : p.image && p.image.startsWith('http')
                            ? p.image
                            : '/images/placeholder.png'
                        }
                        alt={p.name || 'Produk'}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="absolute top-2 left-2">
                      <span className="bg-[#C62828] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        -{discountPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{p.owner?.name || 'Tenant Kampus'}</p>
                      <Link href={`/products/${p._id}`}>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#C62828] transition-colors line-clamp-2 leading-snug mt-0.5">
                          {p.name}
                        </h4>
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        {p.originalPrice > p.price ? (
                          <div className="text-[10px] text-gray-400 line-through">
                            Rp {Number(p.originalPrice).toLocaleString('id-ID')}
                          </div>
                        ) : null}
                        <div className="text-xs sm:text-sm font-extrabold text-[#C62828]">
                          Rp {p.price ? Number(p.price).toLocaleString('id-ID') : '0'}
                        </div>
                      </div>
                      <AddToCartButton product={JSON.parse(JSON.stringify(p))} compact={true} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
