import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import replace from '@rollup/plugin-replace'
import type { RollupReplaceOptions } from '@rollup/plugin-replace'

const ENV_CRUD_ID = loadEnv('', process.cwd()).VITE_API_CRUD_CRUD_ID
console.log('ENV_CRUD_ID', ENV_CRUD_ID)
const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'PWA App',
    short_name: 'PWA App',
    description: 'My Awesome PWA App description',
    theme_color: '#4c466e',
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
          return url.pathname.startsWith(`/api/950519da3d124b3f8a990f318d78cb70/task`)
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
