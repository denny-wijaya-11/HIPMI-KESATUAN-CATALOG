'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "Bisnis hebat dimulai dari langkah kecil! 🚀",
  "Gagal itu bukan akhir, tapi awal dari pelajaran baru 💪",
  "Hari ini adalah hari terbaik untuk mulai berjualan!",
  "Pengusaha muda = masa depan Indonesia 🇮🇩",
  "Jangan tunggu sempurna, mulai aja dulu! ✨",
  "Setiap produk punya cerita, apa ceritamu?",
  "Konsisten itu kuncinya, bukan bakat 🔑",
  "Kolaborasi > Kompetisi 🤝",
  "Dari kampus untuk Indonesia! 🎓",
  "Kamu lebih hebat dari yang kamu kira 🌟",
  "Satu langkah kecil, dampak besar! 🦊",
  "Semangat jualan hari ini! 💼",
  "Kreativitas adalah modal terbaik 🎨",
  "Berani mencoba, berani bertumbuh 🌱",
  "HIPMORA percaya sama kamu! ❤️",
];

export default function MascotWithQuote() {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileQuote, setMobileQuote] = useState('');
  const [hoverQuote, setHoverQuote] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Random quote for mobile on mount/refresh (deferred to avoid lint error)
    const timer = setTimeout(() => {
      setMobileQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 0);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleMouseEnter = () => {
    setHoverQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsHovered(true);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Mascot Image */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ scale: 1.03, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
        >
          <Image
            src="/images/LOGO.png"
            alt="Maskot HIPMORA"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>

        {/* Desktop: Hover tooltip quote */}
        <AnimatePresence>
          {isHovered && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-20 w-64"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 text-center">
                <p className="text-sm text-gray-700 font-medium leading-snug">{hoverQuote}</p>
                {/* Speech bubble arrow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 -mt-1.5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Always show random quote below mascot */}
      {isMobile && mobileQuote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2.5 max-w-[260px]"
        >
          <p className="text-xs text-gray-600 font-medium text-center leading-relaxed">{mobileQuote}</p>
        </motion.div>
      )}
    </div>
  );
}
