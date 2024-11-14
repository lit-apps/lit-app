import { defineConfig } from "vite";

export default defineConfig({
	test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitetestSetup.js'],
    
  },
  // server: {
  //   proxy: {
  //     '/images/material-symbols': {
  //       target: 'http://localhost:5173/images/material-symbols',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/images\/material-symbols/, '')
  //     }
  //   }
  // },
	resolve: {
    dedupe: [
      "router-slot",
      "lit",
      "api-viewer-element",
      "@material/web"

		]}
	});