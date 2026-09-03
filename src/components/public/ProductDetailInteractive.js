'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '@/components/public/WishlistButton';
import ShareButton from '@/components/mobile/ShareButton';
import AddToCartButton from '@/components/public/AddToCartButton';

export default function ProductDetailInteractive({ product }) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/images/placeholder.png'];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);

  const selectedVariant = selectedVariantIdx !== null && product.variants ? product.variants[selectedVariantIdx] : null;
  const currentPrice = product.price + (selectedVariant ? selectedVariant.additionalPrice : 0);
  
  // Clone product to update price for AddToCartButton based on variant
  const productForCart = {
    ...product,
    price: currentPrice,
    selectedVariantName: selectedVariant ? selectedVariant.name : undefined
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        
        {/* Image Section */}
        <div className="flex flex-col border-r border-gray-100">
          <div className="relative h-72 sm:h-96 md:h-full md:min-h-[450px] w-full bg-gray-50">
            <Image 
              src={images[currentImageIdx].startsWith('http') ? images[currentImageIdx] : '/images/placeholder.png'} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300" 
            />
            <WishlistButton product={productForCart} />
            
            {/* Carousel Controls */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? 'bg-[#C62828] w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex p-4 gap-3 overflow-x-auto bg-white">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${idx === currentImageIdx ? 'border-[#C62828]' : 'border-transparent hover:border-gray-300'}`}
                >
                  <Image src={img.startsWith('http') ? img : '/images/placeholder.png'} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
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
          
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Pilih Variasi/Ukuran:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedVariantIdx(null)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedVariantIdx === null ? 'border-[#C62828] bg-red-50 text-[#C62828]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                >
                  Standard
                </button>
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedVariantIdx === idx ? 'border-[#C62828] bg-red-50 text-[#C62828]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                  >
                    {v.name} {v.additionalPrice > 0 && <span className="text-xs opacity-75">(+Rp{(v.additionalPrice).toLocaleString('id-ID')})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {product.description || 'Tidak ada deskripsi.'}
            </p>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto">
              <div>
                <span className="block text-xs text-gray-400 mb-0.5">Harga</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through mb-1 block">Rp {Number(product.originalPrice).toLocaleString('id-ID')}</span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#C62828]">Rp {currentPrice.toLocaleString('id-ID')}</span>
                  {product.originalPrice > product.price && (
                    <span className="bg-red-100 text-[#C62828] text-xs font-bold px-2 py-1 rounded-md">
                      Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <AddToCartButton product={productForCart} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
              <Link
                href={`/chat?userId=${product.owner?._id}&userName=${encodeURIComponent(product.owner?.name || '')}&productId=${product._id}`}
                className="inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat Penjual
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
