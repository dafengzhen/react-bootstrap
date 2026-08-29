import type { RouteConfig } from '@react-router/dev/routes';

import { docs } from './app/doc-config';

export default [
  {
    children: [
      { file: './app/index.tsx', index: true },
      { file: './app/getting-started.tsx', path: 'getting-started' },
      { file: './app/components.tsx', path: 'components' },
      { file: './app/blog.tsx', path: 'blog' },
      ...docs.map((doc) => ({ file: doc.file, path: doc.path.slice(1) })),
      { file: './app/not-found.tsx', path: '*' },
    ],
    file: './app/docs-layout.tsx',
    path: '/',
  },
] satisfies RouteConfig;
