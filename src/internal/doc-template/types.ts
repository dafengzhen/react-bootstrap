import type { HTMLAttributes, ReactNode } from 'react';

export interface ApiProp {
  component?: string;
  defaultValue?: string;
  description: string;
  name: string;
  type: string;
}

export interface ApiTypeDefinition {
  code: string;
  description?: string;
  name: string;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  showCopyButton?: boolean;
  title?: string;
}

export interface DemoSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'id' | 'title'> {
  code?: string;
  codeLanguage?: string;
  id?: string;
  level?: TocLevel;
  title: string;
}

export interface DocTemplateProps {
  componentDescription?: string;
  componentName: string;
  componentTags?: string[];
  demoContent?: ReactNode;
  props: ApiProp[];
  showCopyButton?: boolean;
  typeDefinitions?: ApiTypeDefinition[];
}

export interface TableOfContentsProps {
  items: TocItem[];
  onNavigate?: () => void;
  title?: string;
}

export interface TocItem {
  id: string;
  level: TocLevel;
  title: string;
  to?: string;
}

export type TocLevel = 1 | 2 | 3;
