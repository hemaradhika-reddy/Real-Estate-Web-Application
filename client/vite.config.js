import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server/': {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false

      }
    }
  },
  plugins: [react()],
  
})