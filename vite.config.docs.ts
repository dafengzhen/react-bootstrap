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
  plugins: [react(), bundleAnalyzerPlugin()],
});
