import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.kdiscoms.infinite',
  appName: 'org.kdiscoms.infinite',
  webDir: 'www',
  cordova: {
    preferences: {
      Scheme: 'http',
      usesCleartextTraffic: 'true'
    }
  }
};

export default config;
