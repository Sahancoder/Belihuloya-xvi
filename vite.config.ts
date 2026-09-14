/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { scoreSyncPlugin } from './server/syncPlugin';

export default defineConfig({
  plugins: [react(), scoreSyncPlugin()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: '/control.html',
  },
  preview: {
    port: 4173,
    host: '127.0.0.1',
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        control: resolve(__dirname, 'control.html'),
        overlay: resolve(__dirname, 'overlay.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
