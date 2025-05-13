import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom resolver plugin to handle Node.js internal imports
    {
      name: 'node-internal-imports-resolver',
      resolveId(source) {
        // Handle any imports starting with # (Node.js internal module identifiers)
        if (source.startsWith('#min')) {
          return {
            id: 'data:text/javascript,export default {}',
            external: true
          };
        }
        return null;
      }
    }
  ],
  build: {
    rollupOptions: {
      external: [
        // Explicitly mark these modules as external
        '#minproc',
        '#minpath',
        '#minurl',
        // Add any other Node.js internal modules that might be used
        /^#min.*/  // This regex will match any import starting with #min
      ],
    },
  },
  resolve: {
    // Prevent Vite from trying to resolve these imports
    conditions: ['node', 'import', 'module', 'default'],
  },
  optimizeDeps: {
    exclude: ['vfile', 'unified', 'remark', 'rehype'], // Exclude problematic packages
  },
});
