import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {

  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true
      },
      '/www.googleapis.com': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      },
      '/accounts.google.com': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      },
      '/securetoken.googleapis.com': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      },
      '/identitytoolkit.googleapis.com': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      },
      '/realtimedb': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      },
      '/longpooling': {
        target: 'https://ida-ta.web.app',
        changeOrigin: true,
        cors: true
      }
    },

  },

  test: {
    globals: true,
    silent: 'passed-only',
    // environment: 'happy-dom',
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
  esbuild: {
    legalComments: 'eof', // put all comments at the end of the file, remove duplicate comments
  },
  resolve: {

  },

});
