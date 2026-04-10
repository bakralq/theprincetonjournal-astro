import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theprincetonjournal.app',
  appName: 'The Princeton Journal',
  webDir: 'dist',
  server: {
    url: 'https://theprincetonjournal.com',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
