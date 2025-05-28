import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import omnifaceEnvPlugin from './app/omnicore/plugins/omniface-vite-plugin'
import dotenv from 'dotenv'
import AutoImport from 'unplugin-auto-import/vite'
import app from './app/omnicore/config/app'

dotenv.config({ path: './omniface.cfg' });

// https://vite.dev/config/
export default defineConfig({
  base: './',

  // Set custom project root (where index.html is located)
  root: fileURLToPath(new URL('./', import.meta.url)),
  // Define entry points
  publicDir: fileURLToPath(new URL('./storage', import.meta.url)), // Replaces 'public'

  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store'  // Disable caching for preview
    }
  },

  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  define: {
    'import.meta.env.VITE_SAFE_ROUTES': JSON.stringify(process.env.VITE_SAFE_ROUTES || '')
  },
  optimizeDeps: {
    include: [
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/vue-fontawesome"
    ],
  },
  plugins: [
    vue(),
    app.pwa.enabled ? VitePWA(config.pwa) : undefined,
    vueDevTools(),
    omnifaceEnvPlugin(),
    AutoImport({
      imports: [
        'vue',
        {
          from: '~/omnicore/helpers/useApi',
          imports: ['useApi'],
        }
      ],
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
    alias: {
      '@': fileURLToPath(new URL('./modules', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  server: {
    host: true,
    proxy: {
      '/v1': {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: false
  }
})
