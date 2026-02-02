// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // o 'istanbul'
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 30,
        functions: 10,
        branches: 10,
        statements: 10
      }
    },
  },
});
