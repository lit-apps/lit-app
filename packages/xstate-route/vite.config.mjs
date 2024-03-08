import { defineConfig } from "vite";

export default defineConfig({
	test: {
    browser: {
      enabled: true,
      name: 'chrome',
    },
    root: ".",
  },
  root: "demo",
	resolve: {
    dedupe: [
      "router-slot",
      "xstate",
      "lit",
      "api-viewer-element",
      "@material/web"
		]}
	});