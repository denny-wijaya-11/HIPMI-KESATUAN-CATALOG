import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hipmora.app',
  appName: 'HIPMORA',
  webDir: 'public',
  server: {
    url: 'https://www.hipmora.my.id',
    cleartext: false,
    allowNavigation: ['hipmora.my.id', 'www.hipmora.my.id']
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
