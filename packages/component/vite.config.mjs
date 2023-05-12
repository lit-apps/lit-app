import { defineConfig } from "vite";

export default defineConfig({
	test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitetestSetup.js'],
    
  },
	resolve: {
    dedupe: [
      "router-slot",
      "lit",
      "api-viewer-element",
      "@material/web"

		]}
	});