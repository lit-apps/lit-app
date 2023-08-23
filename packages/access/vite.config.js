import { defineConfig } from "vite";
// import { litHMRPlugin } from './vite-plugin-lit-hmr';

// https://vitejs.dev/config/
export default defineConfig({

  test: {
    onConsoleLog (log) {
      if (log.includes('Download the Vue Devtools extension')) return false
      if (log.includes('Lit is in dev mode.')) return false
    },
    // include: ['./src/**/*.test.ts'],
    browser: {
      enabled: true,
      name: 'chrome',
    },
  },
  // plugins: [litHMRPlugin()],
  resolve: {
    dedupe: [
      "router-slot",
      "lit",
      "api-viewer-element",
      "@material/web",
      "@material/mwc-base",
      "@material/mwc-base/form-element.js", 
      "@material/mwc-button",
      

      "@material/mwc-dialog",
      "@material/mwc-drawer",
       
      

      
       
       
             "@material/mwc-list",
      "@material/mwc-menu",
      "@material/mwc-notched-outline",
      "@material/mwc-radio",
      "@material/mwc-ripple",
      "@material/mwc-ripple/ripple-directive.js",
      "@material/mwc-select",
      "@material/mwc-snackbar",
       ,
      "@material/mwc-tab-bar",
      "@material/mwc-tab",
      "@material/mwc-textarea",
      "@material/mwc-textfield",
      "@material/mwc-top-app-bar",
      "@material/mwc-top-app-bar-fixed",
      "@preignition/preignition-util",
      "@preignition/preignition-widget",
      "@preignition/preignition-demo",
      "@preignition/preignition-mixin",
      "@preignition/preignition-config",
      "@preignition/preignition-state",
    ],
  },
});
