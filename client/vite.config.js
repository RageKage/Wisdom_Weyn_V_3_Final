// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import 'dotenv/config';

// get the link to our server from our .env
// eslint-disable-next-line no-undef
const apiPath = process.env.VITE_NGROK_URL
// const apiPath = 'https://4407-2601-447-c004-bdc0-14a5-e544-e904-afeb.ngrok-free.app'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ! use this when you wanna host it
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: apiPath,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },

  // run locally
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },

  optimizeDeps: {
    include: ['@heroicons/vue'],
  },
})
