import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
      // /uploads is NOT proxied: the API server never serves it (media lives in
      // Supabase Storage), so proxying it only broke the local files in public/.
    }
  }
});
