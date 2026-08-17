import type { ReactNode } from 'react';

export interface DocConfig {
  description: string;

  element: ReactNode;
  name: string;
  order?: number;

  path: string;
  tags?: string[];
}

export interface DocsHomeProps {
  description?: string;
  docs: DocConfig[];
  title?: string;
}

export interface DocsLayoutProps {
  docs: DocConfig[];

  githubUrl?: string;
  sidebarTitle?: string;
}
