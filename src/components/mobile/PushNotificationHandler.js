"use client";

import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export default function PushNotificationHandler({ user }) {
  useEffect(() => {
    // Fitur push notification hanya berjalan di HP (Android/iOS asli), bukan di Web Browser
    if (!Capacitor.isNativePlatform()) return;

    const registerPush = async () => {
      try {
        // 1. Minta izin dari pengguna untuk mengirim notifikasi
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          console.log('User denied push notification permission');
          return;
        }

        // 2. Daftarkan perangkat ke sistem (Firebase/APNs)
        await PushNotifications.register();

        // 3. Listener saat berhasil mendapat token dari Firebase
        await PushNotifications.addListener('registration', async (token) => {
          console.log('Firebase Push registration success, token: ' + token.value);
          try {
            await fetch('/api/profile/fcm-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fcmToken: token.value })
            });
          } catch (e) {
            console.error('Failed to save FCM token', e);
          }
        });

        // 4. Listener jika gagal registrasi
        await PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        // 5. Listener saat notifikasi masuk dan aplikasi sedang dibuka (Foreground)
        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received: ' + JSON.stringify(notification));
          // Notifikasi sudah muncul berkat opsi presentOptions di capacitor.config.ts
        });

        // 6. Listener saat pengguna mengetuk (klik) notifikasi
        await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
          // Nanti: Arahkan pengguna ke halaman spesifik, misal /tenant/orders
        });

      } catch (error) {
        console.error('Push Notifications setup error', error);
      }
    };

    registerPush();

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [user]);

  // Komponen ini tidak menampilkan apa-apa di UI, hanya berjalan di background
  return null;
}
