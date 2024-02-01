// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import 'dotenv/config'

// get the link to our server from our .env
// eslint-disable-next-line no-undef
const apiPath = process.env.VITE_API_URL
// const apiPath = 'https://0d80-2601-243-822-1e1a-98a0-a8bf-1d4b-3149.ngrok-free.app'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiPath,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }},

  optimizeDeps: {
    include: ['@heroicons/vue'],
  },
})
