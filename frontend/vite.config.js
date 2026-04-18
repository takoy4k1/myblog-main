import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/user-api': 'http://localhost:4000',
      '/author-api': 'http://localhost:4000',
      '/admin-api': 'http://localhost:4000',
      '/common-api': 'http://localhost:4000',
    }
  }
})