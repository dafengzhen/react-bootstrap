import type { HTMLAttributes, ReactNode } from 'react';

export interface ApiProp {
  defaultValue?: string;
  description: string;
  name: string;
  type: string;
}

export interface ApiTemplateProps {
  componentDescription?: string;
  componentName: string;
  demoContent?: ReactNode;
  props: ApiProp[];
  showCopyButton?: boolean;
  typeDefinitions?: ApiTypeDefinition[];
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

export interface TableOfContentsProps {
  items: TocItem[];
}

export interface TocItem {
  id: string;
  level: TocLevel;
  title: string;
}

export type TocLevel = 1 | 2 | 3;
