import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any aliases if needed
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Add the problematic import to externals
        '#minproc',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['vfile'], // Exclude vfile from optimization
  },
});
