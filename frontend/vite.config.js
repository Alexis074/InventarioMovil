import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true, // Evita el error 504 (Outdated Optimize Dep) forzando re-optimizar al iniciar
  },
  server: {
    port: 5173,
    host: true,
  },
})
