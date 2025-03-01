import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import path from "path";

// const selectedTheme = process.env.VITE_THEME || "hope-ui";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
    alias: {
      '@': fileURLToPath(new URL('./modules', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      // "@theme": path.resolve(__dirname, `themes/${selectedTheme}`)
    },
  },
  // build: {
  //   rollupOptions: {
  //     external: [`../themes/one-ui/`, `../themes/default/`],
  //   }
  // },
  server: {
    host: true,
    proxy: {
      '/v1': {
        target: process.env.API_BASE_URL || 'http://localhost:9009',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: false
  }
})
