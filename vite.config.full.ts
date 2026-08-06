import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: (format) => {
        if (format === 'es') {
          return 'index.js';
        }

        if (format === 'umd') {
          return 'index.umd.js';
        }

        return 'index.js';
      },
      formats: ['es', 'umd'],
      name: 'ReactBootstrap',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx'],
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
