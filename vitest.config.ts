import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-jwt-secret-key-for-vitest-testing-only',
    },
  },
});
