import type { CapacitorConfig } from '@capacitor/cli';

// By default we do NOT set a remote `server.url` so Capacitor apps load local `dist` assets.
// To use a dev server at runtime set the environment variable `USE_DEV_SERVER=true` when building.
const useDevServer = process.env.USE_DEV_SERVER === 'true';

const config: CapacitorConfig = {
  appId: 'app.lovable.7183aad780544d219b38a21698586b18',
  appName: 'dharma-gate-android',
  webDir: 'dist',
  ...(useDevServer
    ? {
        server: {
          url: 'https://7183aad7-8054-4d21-9b38-a21698586b18.lovableproject.com?forceHideBadge=true',
          cleartext: true,
        },
      }
    : {}),
};

export default config;
