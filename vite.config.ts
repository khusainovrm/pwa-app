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
    background_color: '#ffffff',
    theme_color: '#027be3',
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
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => {
          return url.pathname.includes(`/v1/tasks`)
        },
        method: 'GET',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-task',
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
}

const today = new Date()
today.setHours(today.getHours() + 3)

const replaceOptions: RollupReplaceOptions = {
  preventAssignment: true,
  __BUILD_DATA__: today.toLocaleDateString('ru', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
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
