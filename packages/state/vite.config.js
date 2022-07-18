import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index',
      name: 'state',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: /^lit/,
      output: {
        globals: {
          lit: 'lit'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    dedupe: [
      "lit"
    ]
  },
});
