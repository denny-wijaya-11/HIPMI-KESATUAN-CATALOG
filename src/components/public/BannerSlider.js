'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    id: 1,
    image: '/images/banner-1.png',
    link: '/become-tenant',
    alt: 'Daftar Sebagai Tenant Baru! Dapatkan Diskon Spesial!'
  },
  // Placeholder for second banner as requested "rencananya nanti 2"
  {
    id: 2,
    image: '/images/banner-1.png', // Using the same image for now
    link: '/products',
    alt: 'Jelajahi Katalog Unggulan HIPMORA'
  }
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 pt-4 pb-2 md:pt-8 md:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative aspect-[3/1] md:aspect-[4/1] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {banners.map((banner, idx) => (
            <Link key={banner.id} href={banner.link} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <Image 
                src={banner.image} 
                alt={banner.alt}
                fill
                priority={idx === 0}
                quality={100}
                className="object-cover bg-[#f9f1f1]"
              />
            </Link>
          ))}
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#C62828]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
