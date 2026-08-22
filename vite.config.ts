import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const DEFAULT_EXCLUDED_COMPONENTS: string[] = [];

function getComponentEntries(exclude = DEFAULT_EXCLUDED_COMPONENTS) {
  const componentsDir = resolve(import.meta.dirname, 'src/components');
  const entries: Record<string, string> = {};

  if (!existsSync(componentsDir)) {
    return entries;
  }

  for (const dirent of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || exclude.includes(dirent.name)) {
      continue;
    }

    const componentPath = resolve(componentsDir, dirent.name, 'index.ts');
    if (existsSync(componentPath)) {
      entries[`components/${dirent.name}/index`] = componentPath;
    }
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
      external: (id) => id === 'clsx' || /^react(-dom)?($|\/)/.test(id),
      output: {
        assetFileNames: (assetInfo) => {
          const originalFileNames = assetInfo.originalFileNames ?? [];
          if (!originalFileNames.some((name) => name.endsWith('.css'))) {
            return '[name].[ext]';
          }

          for (const path of originalFileNames) {
            const match = path.match(/src\/components\/([^/]+)\//);
            if (match?.[1]) {
              return `components/${match[1]}/${match[1]}.css`;
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
