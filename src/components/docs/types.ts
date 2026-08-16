import type { ReactNode } from 'react';

export interface DocConfig {
  component: ReactNode;
  description: string;
  icon?: string;
  name: string;
  order?: number;
  tags?: string[];
}

export interface DocsHomeProps {
  description?: string;
  docs: DocConfig[];
  title?: string;
}
