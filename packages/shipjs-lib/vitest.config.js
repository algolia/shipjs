import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.spec.js'],
    exclude: ['src/lib/config/__tests__/example/**'],
    watchExclude: ['sandbox/**'],
  },
});
