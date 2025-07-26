// vite.config.js
export default defineConfig({
  base: '/build/',
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
