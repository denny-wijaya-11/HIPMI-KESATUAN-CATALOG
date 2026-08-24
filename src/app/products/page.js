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
import SearchBar from "@/components/mobile/SearchBar";
import PublicHeader from "@/components/public/PublicHeader";
import { getUserPayload } from "@/lib/auth";
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

async function getAllProducts(category, sort, region, searchQuery, userUniversity, isSatuKampus) {
  await dbConnect();
  
  let query = { isHidden: { $ne: true } };
  
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ];
  }

  if (category && category !== 'Semua') {
    query.category = category;
  }
  if (region && region !== 'Semua') {
    query.region = region;
  }
  if (isSatuKampus && userUniversity) {
    query.university = userUniversity;
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
  const search = resolvedParams?.search;
  const isSatuKampus = resolvedParams?.satuKampus === 'true';
  const products = await getAllProducts(category, sort, region, search, user?.university, isSatuKampus);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      {/* Navbar */}
      <PublicHeader user={user} />

      <main className="relative z-10">
        <section className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Semua Produk</h1>
                <p className="text-gray-500 max-w-xl text-sm md:text-base">
                  Jelajahi seluruh karya dan produk inovatif dari anggota HIPMORA Kesatuan.
                </p>
              </div>
            </div>

            <SearchBar initialQuery={search || ''} />

            <CategoryFilter userUniversity={user?.university} />

            <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400">
                  Belum ada produk di katalog.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id.toString()} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <div className="relative h-32 sm:h-40 md:h-64 w-full bg-gray-50 overflow-hidden">
                      <Link href={`/products/${product._id}`}>
                        <Image 
                          src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                          alt={product.name || 'Produk'} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                        />
                      </Link>
                      <div className="absolute top-2 left-2 md:top-3 md:left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-medium text-gray-700 shadow-sm">
                          {product.category || 'Lainnya'}
                        </span>
                      </div>
                      {product.isFeatured && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3">
                          <span className="bg-amber-400 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[9px] md:text-xs font-semibold text-amber-900">
                            ⭐ Unggulan
                          </span>
                        </div>
                      )}
                      <WishlistButton product={JSON.parse(JSON.stringify(product))} />
                    </div>
                    <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-[10px] md:text-xs text-gray-400 font-medium line-clamp-1">{product.owner?.name || 'HIPMORA Tenant'}</p>
                          {product.region && (
                            <span className="flex items-center text-[9px] md:text-xs text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {product.region}
                            </span>
                          )}
                        </div>
                        <Link href={`/products/${product._id}`}>
                          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 group-hover:text-[#C62828] transition-colors cursor-pointer line-clamp-2 leading-snug">{product.name || 'Produk Tanpa Nama'}</h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-1.5">
                          <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[10px] md:text-xs font-medium text-gray-600">{product.rating ? product.rating.toFixed(1) : 'Baru'}</span>
                          {product.numReviews > 0 && <span className="text-[10px] md:text-xs text-gray-400">({product.numReviews})</span>}
                        </div>
                        <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-relaxed line-clamp-2 hidden sm:block">{product.description || '-'}</p>
                      </div>
                      <div className="mt-2 md:mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through mb-0.5">Rp {Number(product.originalPrice).toLocaleString('id-ID')}</span>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm md:text-lg font-bold text-[#C62828]">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                            {product.originalPrice > product.price && (
                              <span className="bg-red-100 text-[#C62828] text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
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
      <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="relative w-48 h-28 flex items-center justify-center -ml-2">
                  <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Platform katalog resmi yang mewadahi inovasi dan kreasi mahasiswa pengusaha.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Navigasi</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-[#C62828] transition-colors">Beranda</Link></li>
                <li><Link href="/products" className="hover:text-[#C62828] transition-colors">Katalog Produk</Link></li>
                <li><Link href="/#tentang" className="hover:text-[#C62828] transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Kontak</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-[#C62828] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>hipmikatalog@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 text-xs text-center text-gray-400 flex flex-col md:flex-row justify-between items-center gap-3">
            <p>&copy; {new Date().getFullYear()} HIPMORA. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-600 transition-colors">Kebijakan Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-gray-600 transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
