import { defineConfig } from "vite";
import { litHMRPlugin } from './vite-plugin-lit-hmr';

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
  root: './demo',
  publicDir: '../public',
  plugins: [litHMRPlugin()],
  resolve: {
    dedupe: [
      "router-slot",
      "lit",
      "@material/web",
      "@material/mwc-base",
      "@material/mwc-base/form-element.js",
      "@material/mwc-notched-outline",
      "@material/mwc-ripple",
      "@material/mwc-ripple/ripple-directive.js",
      "@material/mwc-snackbar",
      "@preignition/preignition-util",
      "@preignition/preignition-config",
      "@preignition/preignition-state",
    ],
  },
});
