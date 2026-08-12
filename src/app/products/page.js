import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import CategoryFilter from "@/components/public/CategoryFilter";
import AddToCartButton from "@/components/public/AddToCartButton";
import CartIcon from "@/components/public/CartIcon";
import WishlistNavIcon from "@/components/public/WishlistNavIcon";
import WishlistButton from "@/components/public/WishlistButton";
import UserNavMenu from "@/components/public/UserNavMenu";
import PublicHeader from "@/components/public/PublicHeader";
import { getUserPayload } from "@/lib/auth";

export const dynamic = 'force-dynamic';

async function getAllProducts(category, sort, region) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  
  let query = { isHidden: { $ne: true } };
  if (category && category !== 'Semua') {
    query.category = category;
  }
  if (region && region !== 'Semua') {
    query.region = region;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  const products = await Product.find(query).populate('owner', 'name').sort(sortOption);
  return products;
}

export default async function ProductsPage({ searchParams }) {
  const user = await getUserPayload();
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;
  const sort = resolvedParams?.sort;
  const region = resolvedParams?.region;
  const products = await getAllProducts(category, sort, region);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30">
      {/* Abstract Background Elements (Optimized for performance) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0,transparent_50%)] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.15)_0,transparent_50%)] animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(202,138,4,0.15)_0,transparent_50%)] animate-pulse animation-delay-4000" />
      </div>

      {/* Navbar */}
      <PublicHeader user={user} />

      <main className="relative z-10">
        {/* All Products Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-neutral-900/90 border-y border-white/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Semua Produk</h1>
                <p className="text-neutral-400 max-w-xl text-lg">
                  Jelajahi seluruh karya dan produk inovatif dari anggota HIPMORA Kesatuan.
                </p>
              </div>
            </div>

            <CategoryFilter />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-neutral-500">
                  Belum ada produk di katalog.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id.toString()} className="group rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] hover:-translate-y-2 flex flex-col">
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
                      <WishlistButton product={JSON.parse(JSON.stringify(product))} />
                    </div>
                    <div className="p-8 flex-1 flex flex-col relative -mt-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-red-400 font-medium">{product.owner?.name || 'HIPMORA Tenant'}</p>
                          {product.region && (
                            <span className="flex items-center text-xs text-neutral-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {product.region}
                            </span>
                          )}
                        </div>
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
                        <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                <li><Link href="/" className="hover:text-red-400 transition-colors">Beranda</Link></li>
                <li><Link href="/products" className="hover:text-red-400 transition-colors">Katalog Produk</Link></li>
                <li><Link href="/#tentang" className="hover:text-red-400 transition-colors">Tentang Kami</Link></li>
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
