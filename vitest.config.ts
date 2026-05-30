import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import yaml from '@rollup/plugin-yaml';
import path from 'path';

export default defineConfig({
  plugins: [react(), yaml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
  },
});
