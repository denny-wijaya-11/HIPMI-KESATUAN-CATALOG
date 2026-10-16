import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import SiteStat from "@/models/SiteStat";
import AddToCartButton from "@/components/public/AddToCartButton";
import WishlistButton from "@/components/public/WishlistButton";
import PublicHeader from "@/components/public/PublicHeader";
import BannerSlider from "@/components/public/BannerSlider";
import CategoryIconStrip from "@/components/public/CategoryIconStrip";
import FlashDealsRow from "@/components/public/FlashDealsRow";
import EditorialHero from "@/components/public/EditorialHero";
import { getUserPayload } from "@/lib/auth";

export const dynamic = 'force-dynamic';

async function getProducts() {
  await dbConnect();
  let products = await Product.find({ isHidden: { $ne: true } })
    .populate('owner', 'name tenantStatus')
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  return products
    .filter(p => p.owner && p.owner.tenantStatus !== 'suspended')
    .slice(0, 12);
}

async function getFlashDeals() {
  await dbConnect();
  // Find products that have a discount or are featured
  let deals = await Product.find({
    isHidden: { $ne: true },
    $or: [
      { originalPrice: { $gt: 0 } },
      { isFeatured: true }
    ]
  })
    .populate('owner', 'name tenantStatus')
    .sort({ updatedAt: -1 })
    .limit(6)
    .lean();

  if (!deals || deals.length === 0) {
    deals = await Product.find({ isHidden: { $ne: true } })
      .populate('owner', 'name tenantStatus')
      .limit(4)
      .lean();
  }

  return deals.filter(p => p.owner && p.owner.tenantStatus !== 'suspended');
}

export default async function Home() {
  const user = await getUserPayload();

  // Increment total visitors in background
  await dbConnect();
  SiteStat.findOneAndUpdate(
    { id: 'global' },
    { $inc: { totalVisitors: 1 } },
    { upsert: true, returnDocument: 'after' }
  ).exec().catch(err => console.error("Failed to update visitor count:", err));

  const [products, flashDeals] = await Promise.all([
    getProducts(),
    getFlashDeals()
  ]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      {/* Header with Search Bar */}
      <PublicHeader user={user} />

      <main className="pb-16">
        {/* 1. Flagship Editorial Hero with Pose 2 & HIPMORA typography */}
        <EditorialHero />

        {/* 2. Compact Category Strip (Icon Lingkaran) */}
        <CategoryIconStrip />

        {/* 3. Flash Deals Mahasiswa (Diskon & Promo Terbatas) */}
        <FlashDealsRow products={JSON.parse(JSON.stringify(flashDeals))} />

        {/* 4. Rekomendasi Produk Utama (Marketplace Grid) */}
        <section id="produk" className="py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            
            {/* Section Header with Quick Category Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#C62828] rounded-full inline-block"></span>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  Rekomendasi Untukmu
                </h2>
              </div>

              {/* Quick Filter Links */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                <Link
                  href="/products"
                  className="px-3 py-1.5 rounded-lg bg-[#C62828] text-white font-semibold whitespace-nowrap shadow-2xs"
                >
                  Semua
                </Link>
                <Link
                  href="/products?category=Makanan"
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  Makanan
                </Link>
                <Link
                  href="/products?category=Minuman"
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  Minuman
                </Link>
                <Link
                  href="/products?category=Fashion"
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  Fashion
                </Link>
                <Link
                  href="/products?category=Jasa"
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  Jasa
                </Link>
                <Link
                  href="/products"
                  className="text-xs font-bold text-[#C62828] hover:underline whitespace-nowrap ml-2 flex items-center gap-0.5"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>
            </div>

            {/* Product Grid (Tokopedia Density: 2 cols on mobile, 4-5 cols on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Belum ada produk yang tersedia saat ini.</p>
                  <Link href="/products" className="inline-block mt-3 text-xs font-bold text-[#C62828] hover:underline">
                    Eksplorasi Katalog &rarr;
                  </Link>
                </div>
              ) : (
                products.map((product) => {
                  const hasDiscount = product.originalPrice > product.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                  return (
                    <div
                      key={product._id.toString()}
                      className="group bg-white rounded-xl border border-gray-200/90 hover:border-red-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                        <Link href={`/products/${product._id}`}>
                          <Image
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : product.image && product.image.startsWith('http')
                                ? product.image
                                : '/images/placeholder.png'
                            }
                            alt={product.name || 'Produk'}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:scale-104 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {discountPercent && (
                            <span className="bg-[#C62828] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-2xs">
                              -{discountPercent}%
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="bg-amber-400 text-amber-950 text-[9px] font-bold px-1.5 py-0.2 rounded-xs shadow-2xs">
                              ⭐ Unggulan
                            </span>
                          )}
                        </div>

                        <WishlistButton product={JSON.parse(JSON.stringify(product))} />
                      </div>

                      {/* Details */}
                      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Title */}
                          <Link href={`/products/${product._id}`}>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#C62828] transition-colors line-clamp-2 leading-snug cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Pricing */}
                          <div className="mt-1.5">
                            {hasDiscount && (
                              <div className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-none">
                                Rp {Number(product.originalPrice).toLocaleString('id-ID')}
                              </div>
                            )}
                            <div className="text-sm sm:text-base font-extrabold text-[#C62828] leading-tight">
                              Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}
                            </div>
                          </div>
                        </div>

                        {/* Meta: Location, Rating, & Quick Cart */}
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-gray-500">
                          <div className="flex flex-col truncate">
                            <span className="font-medium text-gray-600 truncate">
                              {product.owner?.name || 'Tenant Kampus'}
                            </span>
                            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                              {product.region && (
                                <span className="truncate">📍 {product.region}</span>
                              )}
                              <span>•</span>
                              <span className="text-amber-500 font-semibold">
                                ★ {product.rating ? product.rating.toFixed(1) : '5.0'}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <AddToCartButton product={JSON.parse(JSON.stringify(product))} compact={true} />
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom "Lihat Lebih Banyak" CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-300 hover:border-[#C62828] text-gray-700 hover:text-[#C62828] text-xs sm:text-sm font-bold shadow-2xs transition-all duration-200"
              >
                Muat Lebih Banyak Produk
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

          </div>
        </section>

        {/* 5. Tenant Invitation Callout Banner with Male Mascot */}
        {(!user || user.role !== 'tenant') && (
          <section className="py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 border border-red-100/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Background decorative glow */}
                <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-red-100/50 pointer-events-none blur-3xl" aria-hidden="true" />
                <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-amber-100/40 pointer-events-none blur-3xl" aria-hidden="true" />

                {/* Left/Main Content */}
                <div className="flex-1 text-center md:text-left z-10">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Punya Usaha atau Jualan di Kampus?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl leading-relaxed">
                    Gabung sebagai tenant resmi di HIPMORA hanya <strong className="text-gray-900 font-semibold">Rp 139.000 / bulan</strong>. Jangkau ribuan mahasiswa, kelola pesanan langsung via WhatsApp, dan kembangkan bisnis kampusmu sekarang.
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mt-4 text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Rp 139.000 / Bulan</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Etalase Digital Resmi</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Dukungan Promosi Kampus</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <Link
                      href="/become-tenant"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C62828] hover:bg-[#8E0000] text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <span>Daftar Jadi Tenant</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <span className="text-xs text-gray-500">Mulai Rp 139.000/bln • Verifikasi cepat</span>
                  </div>
                </div>

                {/* Right: Male Mascot */}
                <div className="relative shrink-0 flex items-center justify-center w-full md:w-auto z-10">
                  <div className="relative w-40 sm:w-48 lg:w-52 h-56 sm:h-64 lg:h-72">
                    <Image
                      src="/images/male-pose.png"
                      alt="Maskot Tenant Mahasiswa HIPMORA"
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 208px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-white border-t border-gray-200 pt-10 pb-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="relative w-36 h-12 mb-3">
                <Image
                  src="/images/MASKOT LOGO.png"
                  alt="HIPMORA Logo"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Marketplace resmi ekosistem wirausaha mahasiswa HIPMORA. Belanja hemat karya teman satu kampus.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-2.5">Kategori</h4>
              <ul className="space-y-1.5 text-gray-500">
                <li><Link href="/products?category=Makanan" className="hover:text-[#C62828]">Makanan & Snack</Link></li>
                <li><Link href="/products?category=Minuman" className="hover:text-[#C62828]">Kopi & Minuman</Link></li>
                <li><Link href="/products?category=Fashion" className="hover:text-[#C62828]">Outfit & Fashion</Link></li>
                <li><Link href="/products?category=Jasa" className="hover:text-[#C62828]">Jasa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-2.5">Bantuan & Info</h4>
              <ul className="space-y-1.5 text-gray-500">
                <li><Link href="/products" className="hover:text-[#C62828]">Katalog Produk</Link></li>
                <li><Link href="/become-tenant" className="hover:text-[#C62828]">Buka Toko</Link></li>
                <li><Link href="/syarat-ketentuan" className="hover:text-[#C62828]">Syarat & Ketentuan</Link></li>
                <li><Link href="/kebijakan-privasi" className="hover:text-[#C62828]">Kebijakan Privasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-2.5">Hubungi Kami</h4>
              <p className="text-[11px] text-gray-400 mb-2">
                Punya pertanyaan seputar pesanan atau tenant?
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || ''}?text=Halo%20Admin%20HIPMORA`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
              >
                <span>💬 WhatsApp Admin</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 text-[11px]">
            <p>&copy; {new Date().getFullYear()} HIPMORA. Hak Cipta Dilindungi.</p>
            <div className="flex gap-4">
              <span>Platform Resmi Pengusaha Muda</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
