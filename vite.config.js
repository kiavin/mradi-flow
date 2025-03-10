import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import omnifaceEnvPlugin from './app/omnicore/plugins/omniface-vite-plugin'
import dotenv from 'dotenv'

// Load environment variables from omniface.cfg
dotenv.config({ path: './omniface.cfg' });

// https://vite.dev/config/
export default defineConfig({
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
    omnifaceEnvPlugin()
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
