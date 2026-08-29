import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

// https://reactrouter.com/how-to/pre-rendering
export default defineConfig({
  plugins: [reactRouter()],
  server: {
    watch: {
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/vitest-report/**',
        '**/*.tmpdir',
        '**/*.tmpdir/**',
      ],
    },
  },
});
