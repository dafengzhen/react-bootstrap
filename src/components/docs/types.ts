import type { ReactNode } from 'react';

import type { RenderLink } from '../doc-template';

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
  renderLink?: RenderLink;
  title?: string;
}

export interface DocsLayoutProps {
  children?: ReactNode;
  docs: DocConfig[];
  embedded?: boolean;
  githubUrl?: string;
  pathname?: string;
  renderLink?: RenderLink;
  sidebarTitle?: string;
}
