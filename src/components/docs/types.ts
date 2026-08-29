import type { ReactNode } from 'react';

import type { RenderLink } from '../doc-template';

export interface DocConfig {
  description: string;
  element?: ReactNode;
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
  navItems?: DocsNavItem[];
  navTitle?: string;
  pathname?: string;
  renderLink?: RenderLink;
  rightSidebarTitle?: string;
  sidebarTitle?: string;
}

export interface DocsNavItem {
  label: string;
  to: string;
}
