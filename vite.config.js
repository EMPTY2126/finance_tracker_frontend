import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend has no CORS config yet, so in dev we proxy /api -> the Spring
// Boot server. This makes the browser see everything as same-origin, which
// means the httpOnly "jwt" cookie set by /auth/login works with zero backend
// changes. See README.md for the production alternative (add a CorsConfig
// bean on the backend).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
