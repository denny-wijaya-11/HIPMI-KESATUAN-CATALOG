import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import AddToCartButton from "@/components/public/AddToCartButton";
import CartIcon from "@/components/public/CartIcon";
import WishlistButton from "@/components/public/WishlistButton";
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
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-red-500/30">
      <PublicHeader user={user} />

      <main className="relative z-10 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-8">
            <Link href="/products" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Katalog
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-96 md:h-full min-h-[400px] w-full bg-neutral-800">
                <Image 
                  src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
                <WishlistButton product={JSON.parse(JSON.stringify(product))} />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/50 border border-white/10 text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
                  {product.category || 'Lainnya'}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                <p className="text-red-400 font-medium mb-8">Oleh: {product.owner?.name || 'HIPMORA Tenant'}</p>
                
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Deskripsi Produk</h3>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {product.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                
                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="block text-sm text-neutral-500 mb-1">Harga</span>
                    <span className="text-3xl font-bold text-white">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      href={`/chat?userId=${product.owner?._id}&userName=${product.owner?.name}&productId=${product._id}`}
                      className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all sm:w-auto w-full whitespace-nowrap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Chat Penjual
                    </Link>
                    <div className="transform origin-center sm:scale-110 w-full sm:w-auto">
                      <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-white">Mungkin Anda Suka</h2>
                <Link href={`/products?category=${product.category}`} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors hidden sm:block">
                  Lihat Lebih Banyak &rarr;
                </Link>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relProduct) => (
                  <div key={relProduct._id.toString()} className="group rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] flex flex-col">
                    <div className="relative h-56 w-full bg-neutral-800 overflow-hidden">
                      <Link href={`/products/${relProduct._id}`}>
                        <Image 
                          src={relProduct.image && relProduct.image.startsWith('http') ? relProduct.image : '/images/placeholder.png'} 
                          alt={relProduct.name || 'Produk'} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 cursor-pointer" 
                        />
                      </Link>
                      <WishlistButton product={JSON.parse(JSON.stringify(relProduct))} />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/products/${relProduct._id}`}>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-300 transition-colors cursor-pointer line-clamp-1">{relProduct.name}</h3>
                      </Link>
                      <span className="text-lg font-bold text-white mt-auto">Rp {relProduct.price ? Number(relProduct.price).toLocaleString('id-ID') : '0'}</span>
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
