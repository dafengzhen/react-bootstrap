import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.umd.js'),
      formats: ['es', 'umd'],
      name: 'ReactBootstrap',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'clsx'],
      output: {
        globals: {
          clsx: 'clsx',
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
