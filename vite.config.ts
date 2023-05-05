import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import replace from '@rollup/plugin-replace'
import type { RollupReplaceOptions } from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'PWA App',
    short_name: 'PWA App',
    description: 'My Awesome PWA App description',
    theme_color: '#7863e5',
    background_color: '#ffe5e5',
    icons: [
      {
        src: 'pwa-192x192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/pwa-512x512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html'
  },
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    sourcemap: true,
    runtimeCaching: [
      {
        urlPattern: ({ url }) => {
          return url.pathname.startsWith('/photo')
        },
        handler: 'CacheFirst',
        options: {
          cacheName: 'api-photos',
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: '/',
        handler: 'NetworkFirst'
      }
    ]
  }
}

const replaceOptions: RollupReplaceOptions = { preventAssignment: true }

const reload = process.env.RELOAD_SW === 'true'
if (reload) {
  replaceOptions.__RELOAD_SW__ = 'true'
}

// https://vitejs.dev/config/

export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar(),
    VitePWA(pwaOptions),
    // @ts-ignore
    replace(replaceOptions)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
