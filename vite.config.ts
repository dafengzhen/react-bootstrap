import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import fs from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

function getComponentEntries() {
  const componentsDir = resolve(import.meta.dirname, 'src/components');
  const entries: Record<string, string> = {};

  if (fs.existsSync(componentsDir)) {
    const dirs = fs.readdirSync(componentsDir, { withFileTypes: true });
    dirs.forEach((dirent) => {
      if (dirent.isDirectory()) {
        const componentPath = resolve(componentsDir, dirent.name, 'index.ts');
        if (fs.existsSync(componentPath)) {
          entries[`components/${dirent.name}/index`] = componentPath;
        }
      }
    });
  }

  return entries;
}

export default defineConfig({
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: getComponentEntries(),
      formats: ['es'],
      name: 'ReactBootstrap',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx'],
      output: {
        assetFileNames: (assetInfo) => {
          const originalFilePaths = assetInfo.originalFileNames || [];
          const fileNames = assetInfo.names || [];

          const originalFilePath = originalFilePaths[0] || '';
          const fileName = fileNames[0] || '';

          if (fileName.endsWith('.css') || originalFilePath.endsWith('.css')) {
            for (const path of originalFilePaths) {
              const match = path.match(/src\/components\/([^/]+)\//);
              if (match) {
                const componentName = match[1];
                return `components/${componentName}/${componentName}.css`;
              }
            }
          }

          return '[name].[ext]';
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    sourcemap: true,
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
