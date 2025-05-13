import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#minpath': path.resolve(__dirname, 'node_modules/vfile/lib/minpath.js'),
    },
  },
})
