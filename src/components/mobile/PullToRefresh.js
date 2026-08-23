"use client";

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function PullToRefresh({ children }) {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Hanya aktifkan di HP (Capacitor)
    if (!Capacitor.isNativePlatform()) return;

    const handleTouchStart = (e) => {
      // Hanya mulai pull jika scroll berada di paling atas
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY !== 0 || startY === 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0) {
        setIsPulling(true);
        // Batasi maksimal tarikan 80px
        setPullDistance(Math.min(distance * 0.4, 80)); 
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && !isRefreshing) {
        // Trigger haptic ketika pull sudah cukup jauh untuk refresh
        try {
          await Haptics.impact({ style: ImpactStyle.Medium });
        } catch(e) {}
        
        setIsRefreshing(true);
        // Lakukan reload data / halaman
        router.refresh();
        
        // Simulasi loading selama 1 detik agar spinner terlihat
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }, 1000);
      } else {
        // Batal tarik
        setPullDistance(0);
        setIsPulling(false);
      }
      setStartY(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, isRefreshing, router]);

  return (
    <div className="w-full h-full flex-1 relative">
      {/* Indikator Loading di Atas Layar */}
      <div 
        className="fixed top-0 left-0 right-0 flex justify-center items-center z-[100] transition-all duration-300 pointer-events-none"
        style={{ 
          height: `${pullDistance}px`,
          opacity: pullDistance > 20 ? 1 : 0
        }}
      >
        <div 
          className="bg-white rounded-full shadow-md p-2 flex items-center justify-center transform transition-transform"
          style={{ transform: `rotate(${pullDistance * 5}deg)` }}
        >
          <svg className={`w-6 h-6 text-[#C62828] ${isRefreshing ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      {/* Konten Utama */}
      <div 
        className="transition-transform duration-300 h-full"
        style={{ transform: `translateY(${isRefreshing ? 60 : pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
