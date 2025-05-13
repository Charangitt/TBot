import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom resolver plugin to handle Node.js imports
    {
      name: 'node-modules-polyfill',
      resolveId(source, importer) {
        // Handle Node.js module polyfills
        if (source === 'module' && importer && importer.includes('fflate')) {
          return { id: 'virtual:module-polyfill', external: false };
        }
        
        // Handle min* imports from vfile
        if (source.startsWith('#min')) {
          return { id: 'virtual:min-polyfill', external: false };
        }
        
        return null;
      },
      load(id) {
        // Provide polyfill for module imports
        if (id === 'virtual:module-polyfill') {
          return `
            export function createRequire() { 
              return function fakeRequire(id) { 
                console.warn('Attempted to require ' + id + ' but we are in the browser'); 
                return {}; 
              } 
            }
          `;
        }
        
        // Provide polyfill for #min* imports
        if (id === 'virtual:min-polyfill') {
          return `
            export default {};
            export const basename = path => path.split('/').pop();
            export const dirname = path => path.split('/').slice(0, -1).join('/');
            export const cwd = () => '/';
            export const fileURLToPath = url => url.replace('file://', '');
          `;
        }
        
        return null;
      }
    }
  ],
  build: {
    rollupOptions: {
      external: [
        // Mark problematic Node.js modules as external or provide alternatives
      ],
      output: {
        // Ensure output is suitable for browser environment
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      // Add aliases for Node.js core modules
      module: 'virtual:module-polyfill',
      // Alias problematic packages to their browser versions or polyfills
      fflate: path.resolve(__dirname, './src/polyfills/fflate-browser.js'),
    },
  },
  optimizeDeps: {
    exclude: ['vfile', 'unified', 'remark', 'rehype', 'fflate'], 
  },
});
