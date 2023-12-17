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
    environmentOptions: {
      'happyDOM': {
        url: 'http://localhost:3000/index?aa=5',
      },
    },
  },
  resolve: {
    dedupe: [
      "lit"
    ]
  },
});
