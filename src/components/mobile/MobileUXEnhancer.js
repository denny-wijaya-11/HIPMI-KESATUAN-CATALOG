"use client";

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export default function MobileUXEnhancer() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupNativeUX = async () => {
        try {
          // Mengubah warna Status Bar Android menjadi merah
          await StatusBar.setBackgroundColor({ color: '#C62828' });
          // Mengatur ikon status bar menjadi terang (putih) karena background-nya gelap
          await StatusBar.setStyle({ style: Style.Dark }); 
        } catch (error) {
          console.error("Gagal mengatur Status Bar:", error);
        }
      };

      setupNativeUX();
    }
  }, []);

  return null;
}
