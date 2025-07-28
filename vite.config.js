// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.APP_URL + '/build/', // 👈 dynamically uses your HTTPS domain
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
  },
  plugins: [
    laravel({
      input: ['resources/js/main.jsx'],
      refresh: true,
    }),
    react(),
  ],
});
