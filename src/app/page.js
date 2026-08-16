import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import SiteStat from "@/models/SiteStat";
import AddToCartButton from "@/components/public/AddToCartButton";
import CartIcon from "@/components/public/CartIcon";
import WishlistNavIcon from "@/components/public/WishlistNavIcon";
import WishlistButton from "@/components/public/WishlistButton";
import UserNavMenu from "@/components/public/UserNavMenu";
import PublicHeader from "@/components/public/PublicHeader";
import { FadeInUp, FadeInScale, StaggerContainer, HoverScale } from "@/components/public/MotionWrappers";
import { SpotlightBackground, TiltCard, GlowingButton, TextReveal, ParticleBackground } from "@/components/public/Web3Components";
import { getUserPayload } from "@/lib/auth";

export const dynamic = 'force-dynamic';

async function getProducts() {
  await dbConnect();
  const products = await Product.find({ isFeatured: true, isHidden: { $ne: true } }).populate('owner', 'name').sort({ createdAt: -1 }).limit(5);
  return products;
}

export default async function Home() {
  const user = await getUserPayload();

  // Increment total visitors in background without awaiting (to not slow down render)
  await dbConnect();
  SiteStat.findOneAndUpdate(
    { id: 'global' },
    { $inc: { totalVisitors: 1 } },
    { upsert: true, returnDocument: 'after' }
  ).exec().catch(err => console.error("Failed to update visitor count:", err));

  const products = await getProducts();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30">
      {/* Abstract Background Elements (Web3 Style) */}
      <ParticleBackground />

      {/* Navbar */}
      <PublicHeader user={user} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <FadeInUp delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-8">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Platform Katalog Resmi
                </div>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
                  Mendukung Ekosistem <br/>
                  <TextReveal text="Pengusaha Muda" className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 animate-gradient inline-flex" />
                </h1>
              </FadeInUp>
              <FadeInUp delay={0.3}>
                <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
                  Temukan dan dukung produk-produk kreatif hasil karya mahasiswa pengusaha dari HIPMORA. Inovasi berawal dari sini.
                </p>
              </FadeInUp>
              <FadeInUp delay={0.4}>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <GlowingButton href="/products">
                    Eksplorasi Katalog
                  </GlowingButton>
                  <HoverScale>
                    <Link href="#tentang" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300">
                      Pelajari Lebih Lanjut
                    </Link>
                  </HoverScale>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="produk" className="py-24 relative">
          <div className="absolute inset-0 bg-neutral-900/90 border-y border-white/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Katalog Unggulan</h2>
                <p className="text-neutral-400 max-w-xl text-lg">
                  Kurasi produk terbaik dari anggota HIPMORA minggu ini.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors group">
                Lihat Semua Koleksi
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <StaggerContainer className="grid gap-3 md:gap-8 grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-neutral-500">
                  Belum ada produk unggulan saat ini.
                </div>
              ) : (
                products.map((product) => (
                  <TiltCard key={product._id.toString()} className="group flex flex-col h-full shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
                    <div className="relative h-28 sm:h-36 md:h-72 w-full bg-neutral-800 overflow-hidden">
                      <Link href={`/products/${product._id}`}>
                        <Image 
                          src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                          alt={product.name || 'Produk'} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 cursor-pointer" 
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent pointer-events-none" />
                      <div className="absolute top-2 right-2 md:top-5 md:right-5 flex flex-col items-end gap-1 md:gap-2 pointer-events-none">
                        <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-xs font-semibold text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          {product.category || 'Lainnya'}
                        </div>
                        {product.isFeatured && (
                          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-xs font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300/30">
                            Unggulan 🔥
                          </div>
                        )}
                      </div>
                      <WishlistButton product={JSON.parse(JSON.stringify(product))} />
                    </div>
                    <div className="p-2.5 sm:p-4 md:p-8 flex-1 flex flex-col relative -mt-3 md:-mt-6 bg-gradient-to-t from-neutral-950/90 to-transparent">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                          <p className="text-[10px] md:text-sm text-red-400 font-medium group-hover:text-red-300 transition-colors line-clamp-1">{product.owner?.name || 'HIPMORA Tenant'}</p>
                          {product.region && (
                            <span className="flex items-center text-[9px] md:text-xs text-neutral-400 line-clamp-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {product.region}
                            </span>
                          )}
                        </div>
                        <Link href={`/products/${product._id}`}>
                          <h3 className="text-xs sm:text-sm md:text-2xl font-bold text-white mb-1 md:mb-3 group-hover:text-red-400 transition-colors cursor-pointer line-clamp-2 leading-tight">{product.name || 'Produk Tanpa Nama'}</h3>
                        </Link>
                        <p className="text-neutral-400 text-[9px] sm:text-[10px] md:text-sm leading-relaxed line-clamp-2 mt-0.5">{product.description || '-'}</p>
                      </div>
                      <div className="mt-2 md:mt-8 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] sm:text-[9px] md:text-xs text-neutral-500 mb-0.5">Harga</span>
                          <span className="text-[11px] sm:text-xs md:text-2xl font-bold text-white tracking-tight">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                        </div>
                        <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                      </div>
                    </div>
                  </TiltCard>
                ))
              )}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-900/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SpotlightBackground className="rounded-3xl">
              <div className="bg-gradient-to-br from-red-900/40 to-neutral-900/90 border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Punya Bisnis Inovatif?
                </h2>
                <p className="text-lg text-red-200 max-w-2xl mx-auto mb-10">
                  Bergabunglah dengan ratusan mahasiswa pengusaha lainnya. Dapatkan akses ke pasar yang lebih luas dan komunitas yang suportif.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <GlowingButton href="/login">
                    Daftar Sebagai Tenant
                  </GlowingButton>
                  <HoverScale>
                    <Link href="#tentang" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
                      Hubungi Admin
                    </Link>
                  </HoverScale>
                </div>
              </div>
            </SpotlightBackground>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-neutral-950 border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                 <div className="relative w-72 h-40 flex items-center justify-center -ml-4">
                  <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
                </div>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                Platform katalog resmi yang mewadahi inovasi dan kreasi mahasiswa pengusaha. Membangun ekosistem wirausaha yang kuat di lingkungan kampus.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Navigasi</h3>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-red-400 transition-colors">Beranda</Link></li>
                <li><Link href="#produk" className="hover:text-red-400 transition-colors">Katalog Produk</Link></li>
                <li><Link href="#" className="hover:text-red-400 transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Kontak</h3>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Kampus Utama</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>info@hipmora.org</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-sm text-center text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} HIPMORA. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
