import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   lib: {
  //     entry: 'src/apt-state.js',
  //     formats: ['es']
  //   },
  //   rollupOptions: {
  //     external: /^lit/
  //   }
  // }
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    dedupe: [
      "router-slot",
      "lit",
      "api-viewer-element",
      "@material/mwc-base",
      "@material/mwc-base/form-element.js",
      "@material/mwc-button",
      "@material/mwc-checkbox",
      "@material/mwc-circular-progress-four-color",
      "@material/mwc-circular-progress",
      "@material/mwc-dialog",
      "@material/mwc-drawer",
      "@material/mwc-fab",
      "@material/mwc-formfield",
      "@material/mwc-icon-button",
      "@material/mwc-icon",
      "@material/mwc-icon",
      "@material/mwc-linear-progress",
      "@material/mwc-list",
      "@material/mwc-menu",
      "@material/mwc-notched-outline",
      "@material/mwc-radio",
      "@material/mwc-ripple",
      "@material/mwc-ripple/ripple-directive.js",
      "@material/mwc-select",
      "@material/mwc-snackbar",
      "@material/mwc-switch",
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
