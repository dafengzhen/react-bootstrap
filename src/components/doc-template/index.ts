export { CodeBlock } from './code-block.tsx';
export { DemoSection } from './demo-section.tsx';
export { DocSidebarContext, useDocSidebar } from './doc-sidebar-context.ts';
export { DocTemplate } from './doc-template.tsx';
export { CodeBlockHighlightContext, useCodeBlockHighlight } from './highlight-context.ts';
export { extractFencedCode } from './markdown.ts';
export { NameColorBadge, nameToColor } from './name-badge.tsx';
export { TableOfContents } from './table-of-contents.tsx';
export type {
  ApiProp,
  ApiTypeDefinition,
  CodeBlockProps,
  DemoSectionProps,
  DocTemplateProps,
  HighlightElement,
  LinkRenderProps,
  RenderLink,
  TableOfContentsProps,
  TocItem,
  TocLevel,
} from './types.ts';
export { scrollToSection, slugify, updateHash, useIdPrefix } from './utils.ts';
