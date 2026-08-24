import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import AddToCartButton from "@/components/public/AddToCartButton";
import CartIcon from "@/components/public/CartIcon";
import WishlistButton from "@/components/public/WishlistButton";
import ShareButton from "@/components/mobile/ShareButton";
import ReviewSection from "@/components/public/ReviewSection";
import UserNavMenu from "@/components/public/UserNavMenu";
import PublicHeader from "@/components/public/PublicHeader";
import { getUserPayload } from "@/lib/auth";
import { notFound } from "next/navigation";
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

async function getProductAndRelated(id) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { product: null, relatedProducts: [] };
  }

  const product = await Product.findById(id).populate('owner', 'name');
  if (!product) return { product: null, relatedProducts: [] };

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isHidden: { $ne: true }
  }).populate('owner', 'name').limit(4);

  return { product, relatedProducts };
}

export default async function ProductDetailPage({ params }) {
  const user = await getUserPayload();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { product, relatedProducts } = await getProductAndRelated(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      <PublicHeader user={user} />

      <main className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-[#C62828] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Katalog
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-72 sm:h-96 md:h-full md:min-h-[450px] w-full bg-gray-50">
                <Image 
                  src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
                <WishlistButton product={JSON.parse(JSON.stringify(product))} />
              </div>
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit">
                  {product.category || 'Lainnya'}
                </span>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                  <ShareButton title={product.name} text={product.description || `Cek ${product.name} di HIPMORA!`} />
                </div>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                  <span className="text-xs text-gray-400">({product.numReviews || 0} ulasan)</span>
                </div>

                <p className="text-[#C62828] text-sm font-medium mb-6">Oleh: {product.owner?.name || 'HIPMORA Tenant'}</p>
                
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {product.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Harga</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#C62828]">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <Link
                      href={`/chat?userId=${product.owner?._id}&userName=${product.owner?.name}&productId=${product._id}`}
                      className="inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Chat Penjual
                    </Link>
                    <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <ReviewSection 
            productId={product._id.toString()} 
            initialReviews={JSON.parse(JSON.stringify(product.reviews || []))} 
            user={user} 
          />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 md:mt-16">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Mungkin Anda Suka</h2>
                <Link href={`/products?category=${product.category}`} className="text-[#C62828] hover:text-[#8E0000] text-sm font-medium transition-colors hidden sm:block">
                  Lihat Lebih Banyak &rarr;
                </Link>
              </div>
              <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relProduct) => (
                  <div key={relProduct._id.toString()} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <div className="relative h-28 sm:h-36 md:h-48 w-full bg-gray-50 overflow-hidden">
                      <Link href={`/products/${relProduct._id}`}>
                        <Image 
                          src={relProduct.image && relProduct.image.startsWith('http') ? relProduct.image : '/images/placeholder.png'} 
                          alt={relProduct.name || 'Produk'} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                        />
                      </Link>
                      <WishlistButton product={JSON.parse(JSON.stringify(relProduct))} />
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col">
                      <Link href={`/products/${relProduct._id}`}>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#C62828] transition-colors cursor-pointer line-clamp-2 leading-snug">{relProduct.name}</h3>
                      </Link>
                      <span className="text-xs sm:text-sm font-bold text-[#C62828] mt-auto">Rp {relProduct.price ? Number(relProduct.price).toLocaleString('id-ID') : '0'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
