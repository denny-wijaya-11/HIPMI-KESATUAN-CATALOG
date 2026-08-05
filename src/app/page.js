import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

async function getProducts() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  const products = await Product.find({}).populate('owner', 'name').sort({ createdAt: -1 }).limit(6);
  return products;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-900/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-amber-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-950/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">
            <div className="flex items-center group cursor-pointer h-full py-2">
              <div className="relative w-64 h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" priority />
              </div>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="#" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Beranda</Link>
              <Link href="#produk" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Katalog Unggulan</Link>
              <Link href="#" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-red-500 hover:after:w-full after:transition-all after:duration-300 pb-1">Tentang Kami</Link>
            </nav>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Platform Katalog Resmi
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
                Mendukung Ekosistem <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 animate-gradient">
                  Pengusaha Muda
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
                Temukan dan dukung produk-produk kreatif hasil karya mahasiswa pengusaha dari HIPMORA. Inovasi berawal dari sini.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="#produk" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-300 hover:-translate-y-1">
                  Eksplorasi Katalog
                </Link>
                <Link href="#tentang" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="produk" className="py-24 relative">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-3xl border-y border-white/5" />
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

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-neutral-500">
                  Belum ada produk di katalog.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id.toString()} className="group rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] hover:-translate-y-2 flex flex-col">
                    <div className="relative h-72 w-full bg-neutral-800 overflow-hidden">
                      <Image 
                        src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                        alt={product.name || 'Produk'} 
                        fill 
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/20 to-transparent" />
                      <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                        {product.category || 'Lainnya'}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col relative -mt-6">
                      <div className="flex-1">
                        <p className="text-sm text-red-400 font-medium mb-2">{product.owner?.name || 'HIPMORA Tenant'}</p>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors">{product.name || 'Produk Tanpa Nama'}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">{product.description || '-'}</p>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-neutral-500 mb-1">Harga</span>
                          <span className="text-2xl font-bold text-white">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                        </div>
                        <button className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-3 rounded-2xl transition-all duration-300 border border-red-500/30">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-900/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-br from-red-900/50 to-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Punya Bisnis Inovatif?
              </h2>
              <p className="text-lg text-red-200 max-w-2xl mx-auto mb-10">
                Bergabunglah dengan ratusan mahasiswa pengusaha lainnya. Dapatkan akses ke pasar yang lebih luas dan komunitas yang suportif.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-neutral-900 bg-white hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
                  Daftar Sebagai Tenant
                </Link>
                <Link href="#tentang" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
                  Hubungi Admin
                </Link>
              </div>
            </div>
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
