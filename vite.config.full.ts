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
      external: (id) =>
        id === 'clsx' ||
        id === 'react' ||
        id === 'react/jsx-runtime' ||
        /^react-dom($|\/)/.test(id),
      output: {
        globals: {
          clsx: 'clsx',
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
