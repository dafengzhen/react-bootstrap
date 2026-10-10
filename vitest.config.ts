import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: ['e2e/**', 'src/**/demos/**', 'src/**/*.test.{ts,tsx}'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
    expect: {
      poll: {
        timeout: 5000,
      },
    },
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          environment: 'node',
          include: ['src/**/*.node.test.{ts,tsx}', 'src/**/__tests__/**/*.node.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        extends: true,
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: 'chromium',
              },
            ],
            provider: playwright(),
            screenshotFailures: false,
            viewport: {
              height: 896,
              width: 1280,
            },
          },
          include: [
            'src/**/*.browser.test.{ts,tsx}',
            'src/**/__tests__/**/*.browser.test.{ts,tsx}',
          ],
          name: 'browser',
        },
      },
    ],
    reporters: process.env.CI ? ['dot'] : ['default'],
    restoreMocks: true,
  },
});
