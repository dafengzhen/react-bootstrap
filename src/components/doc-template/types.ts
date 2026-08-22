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
  highlightElement?: HighlightElement;
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
  embedded?: boolean;
  props: ApiProp[];
  showCopyButton?: boolean;
  typeDefinitions?: ApiTypeDefinition[];
}

export type HighlightElement = (element: HTMLElement) => void;

export interface LinkRenderProps {
  children: ReactNode;
  className?: string;
  to: string;
}

export type RenderLink = (props: LinkRenderProps) => ReactNode;

export interface TableOfContentsProps {
  activeTo?: string;
  items: TocItem[];
  onNavigate?: () => void;
  renderLink?: RenderLink;
  title?: string;
}

export interface TocItem {
  id: string;
  level: TocLevel;
  title: string;
  to?: string;
}

export type TocLevel = 1 | 2 | 3;
