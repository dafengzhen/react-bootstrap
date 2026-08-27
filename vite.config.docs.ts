import react from '@vitejs/plugin-react';
import { bundleAnalyzerPlugin } from 'rolldown/experimental';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'docs-dist',
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              priority: 20,
              test: /node_modules[\\/]react/,
            },
          ],
          minSize: 20000,
        },
      },
    },
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      'highlight.js/lib/core',
      'highlight.js/lib/languages/typescript',
      'highlight.js/lib/languages/xml',
      'highlight.js/lib/languages/python',
      'highlight.js/lib/languages/java',
      'highlight.js/lib/languages/go',
      'highlight.js/lib/languages/rust',
      'highlight.js/lib/languages/cpp',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/json',
      'highlight.js/lib/languages/yaml',
      'highlight.js/lib/languages/bash',
      'highlight.js/lib/languages/sql',
    ],
  },
  plugins: [react(), bundleAnalyzerPlugin()],
  server: {
    watch: {
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/vitest-report/**',
        // 文件工具的原子写入临时目录：监视器 watch 到它时它可能已被删除，会触发 Windows 下 chokidar 的 EBUSY 崩溃
        '**/*.tmpdir',
        '**/*.tmpdir/**',
      ],
    },
  },
});
