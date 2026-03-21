import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        intro: resolve(__dirname, 'intro.html'),
        login: resolve(__dirname, 'login.html'),
        index: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        features: resolve(__dirname, 'features.html'),
        cases: resolve(__dirname, 'cases.html'),
      },
    },
  },
});
