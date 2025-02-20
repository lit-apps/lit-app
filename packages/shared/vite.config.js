import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({

  test: {
    onConsoleLog(log) {
      if (log.includes('Download the Vue Devtools extension')) return false
      if (log.includes('Lit is in dev mode.')) return false
    },
    // include: ['./src/**/*.test.ts'],
    browser: {
      enabled: true,
      name: 'chrome',
    },
  },

});
