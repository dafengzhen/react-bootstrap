import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

// https://reactrouter.com/how-to/pre-rendering
export default defineConfig({
  define: {
    // The Vercel analytics script is only served on Vercel deployments.
    'import.meta.env.VITE_VERCEL': JSON.stringify(process.env.VERCEL === '1' ? '1' : ''),
  },
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
