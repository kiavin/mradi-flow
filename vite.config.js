import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import omnifaceEnvPlugin from './app/omnicore/plugins/omniface-vite-plugin';

// const selectedTheme = process.env.VITE_THEME || "hope-ui";

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
