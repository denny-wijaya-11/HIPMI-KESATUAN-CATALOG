'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function EditorialHero() {
  return (
    <section className="relative w-full bg-white border-b border-gray-100 overflow-hidden">
      
      {/* Hero Canvas Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-[440px] sm:h-[540px] md:h-[660px] lg:h-[740px] flex flex-col justify-between pt-4 sm:pt-6 pb-2 md:pb-6">

        {/* 1. TOP ROW: Quote on Left, Striped Number on Right */}
        <div className="relative z-20 flex items-start justify-between gap-3">
          
          {/* Top Left Quote Block */}
          <div className="max-w-[210px] sm:max-w-xs md:max-w-md">
            <span className="text-2xl sm:text-4xl md:text-5xl font-serif text-gray-900 leading-none select-none block -mb-0.5">
              “
            </span>
            <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-extrabold text-gray-900 tracking-tight uppercase leading-tight sm:leading-snug">
              WADAH INOVASI &amp; WIRAUSAHA MAHASISWA; TEMUKAN DAN DUKUNG KARYA TEMAN SATU ALMAMATER.
            </h2>
            <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 font-bold tracking-wider uppercase mt-1 sm:mt-2">
              HIPMORA — Official Student Catalog
            </p>
          </div>

          {/* Top Right Diagonal-Hatched Number (Year '26 like '15 in reference) */}
          <div className="shrink-0 select-none">
            <div 
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #1A1A1A, #1A1A1A 3px, transparent 3px, transparent 8px)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              26
            </div>
          </div>
        </div>

        {/* 2. BACKGROUND GIANT TYPOGRAPHY: HIPMORA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-2 sm:px-4">
          <span 
            className="text-[17vw] sm:text-[15vw] md:text-[13.5vw] lg:text-[14vw] font-black text-[#C62828] tracking-tight uppercase leading-none select-none text-center transform translate-y-2 sm:translate-y-4 md:translate-y-6"
          >
            HIPMORA
          </span>
        </div>

        {/* 3. CENTER FOREGROUND CUTOUT CHARACTER (Clean Transparent PNG) */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center items-end pointer-events-none">
          <div className="relative w-[280px] sm:w-[360px] md:w-[460px] lg:w-[520px] h-[370px] sm:h-[470px] md:h-[590px] lg:h-[670px] pointer-events-auto">
            <Image
              src="/images/female-pose.png"
              alt="Model Mahasiswa HIPMORA"
              fill
              priority
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 460px, 520px"
              className="object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>

        {/* 4. DESKTOP WIDGETS: Floating at bottom-left and bottom-right (Desktop Only) */}
        <div className="hidden md:flex relative z-30 items-end justify-between gap-4 w-full mt-auto">
          
          {/* Bottom Left: Catalog Media Preview Card */}
          <Link
            href="/products"
            className="group flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-red-200 transition-all cursor-pointer max-w-xs"
          >
            <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image 
                src="/images/banner-1.png" 
                alt="Katalog Thumbnail" 
                fill 
                sizes="96px"
                className="object-cover group-hover:scale-108 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-[#C62828] text-white flex items-center justify-center shadow-md group-hover:scale-115 transition-transform">
                  <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pr-1">
              <span className="text-[10px] font-bold text-[#C62828] uppercase tracking-wider block">
                Katalog Resmi
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#C62828] transition-colors leading-tight mt-0.5">
                Eksplorasi Produk Mahasiswa
              </h4>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                Buka Katalog Lengkap &rarr;
              </span>
            </div>
          </Link>

          {/* Bottom Right: Floating Dark Deals Widget */}
          <div className="bg-[#111113] text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-white/10 w-68">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
              <span className="bg-[#C62828] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                SPECIAL DEALS
              </span>
              <span className="text-[9px] text-gray-400 font-medium">Hari Ini • Area Kampus</span>
            </div>
            
            <div className="flex items-center justify-between py-1 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🎓</div>
                <div>
                  <div className="text-[11px] font-bold leading-tight">Mahasiswa</div>
                  <div className="text-[9px] text-gray-400">Harga Teman</div>
                </div>
              </div>
              <span className="text-[9px] font-black bg-white/10 px-1.5 py-0.5 rounded text-amber-400">VS</span>
              <div className="flex items-center gap-1.5 text-right">
                <div>
                  <div className="text-[11px] font-bold leading-tight">Kebutuhan Kos</div>
                  <div className="text-[9px] text-gray-400">COD / Kirim</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">📦</div>
              </div>
            </div>

            <Link 
              href="/products" 
              className="mt-2.5 block text-center py-1.5 rounded-xl bg-white/10 hover:bg-[#C62828] text-white text-[10px] font-bold transition-colors cursor-pointer"
            >
              Lihat Semua Penawaran &rarr;
            </Link>
          </div>

        </div>

      </div>

      {/* 5. MOBILE WIDGETS BAR: Placed right below the character so the character is 100% visible and unblocked */}
      <div className="md:hidden relative z-30 px-3.5 pt-2 pb-4 bg-white border-t border-gray-100 flex flex-col gap-2.5">
        
        {/* Mobile Deals Widget */}
        <div className="bg-[#111113] text-white rounded-2xl p-3 shadow-md border border-white/10">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
            <span className="bg-[#C62828] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              SPECIAL DEALS
            </span>
            <span className="text-[9px] text-gray-400 font-medium">Hari Ini • Area Kampus</span>
          </div>
          
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🎓</div>
              <div>
                <div className="text-[11px] font-bold leading-tight">Mahasiswa</div>
                <div className="text-[9px] text-gray-400">Harga Teman</div>
              </div>
            </div>
            <span className="text-[9px] font-black bg-white/10 px-1.5 py-0.5 rounded text-amber-400">VS</span>
            <div className="flex items-center gap-1.5 text-right">
              <div>
                <div className="text-[11px] font-bold leading-tight">Kebutuhan Kos</div>
                <div className="text-[9px] text-gray-400">COD / Kirim</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">📦</div>
            </div>
          </div>

          <Link 
            href="/products" 
            className="mt-2 block text-center py-1.5 rounded-xl bg-white/10 hover:bg-[#C62828] text-white text-[10px] font-bold transition-colors cursor-pointer"
          >
            Lihat Semua Penawaran &rarr;
          </Link>
        </div>

        {/* Mobile Catalog Quick Link */}
        <Link
          href="/products"
          className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2.5 rounded-xl border border-gray-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C62828] text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">Katalog Resmi Mahasiswa</h4>
              <p className="text-[10px] text-gray-500">Eksplorasi ratusan produk kreatif kampus</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#C62828]">&rarr;</span>
        </Link>

      </div>

    </section>
  );
}
