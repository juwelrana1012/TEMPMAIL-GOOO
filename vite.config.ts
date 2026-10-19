import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const copy404Plugin = () => ({
  name: 'copy-404',
  closeBundle() {
    try {
      const distIndex = path.resolve(process.cwd(), 'dist/index.html');
      const dist404 = path.resolve(process.cwd(), 'dist/404.html');
      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist404);
      }
    } catch {}
  },
});

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      copy404Plugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'apple-touch-icon.png',
          'app-logo-circle.png',
          'app-logo.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'user-avatar.png',
        ],
        manifest: {
          id: '/',
          name: 'TempMailGo',
          short_name: 'TempMailGo',
          description: 'Instant disposable inbox and automatic OTP & 2FA verification code receiver.',
          theme_color: '#123B92',
          background_color: '#123B92',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          prefer_related_applications: false,
          categories: ['utilities', 'productivity', 'tools'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,webmanifest}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      hmr: false,
      watch: null,
    },
  };
});
