import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import omnifaceEnvPlugin from './app/omnicore/plugins/omniface-vite-plugin'
import dotenv from 'dotenv'
import AutoImport from 'unplugin-auto-import/vite'

dotenv.config({ path: './omniface.cfg' });

// https://vite.dev/config/
export default defineConfig({
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
