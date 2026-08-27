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
import ProductDetailInteractive from "@/components/public/ProductDetailInteractive";
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

          <ProductDetailInteractive product={JSON.parse(JSON.stringify(product))} />

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
