import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hipmi.hipmora',
  appName: 'HIPMORA',
  webDir: 'public',
  server: {
    url: 'https://hipmora.my.id',
    cleartext: true
  }
};

export default config;
