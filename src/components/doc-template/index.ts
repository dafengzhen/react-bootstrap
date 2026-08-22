export {
  CodeBlockHighlightContext,
  useCodeBlockHighlight,
} from './code-block-highlight-context.ts';
export { CodeBlock } from './code-block.tsx';
export { DemoSection } from './demo-section.tsx';
export { DocSidebarContext, useDocSidebar } from './doc-sidebar-context.ts';
export { scrollToSection, slugify, updateHash, useIdPrefix } from './doc-template-utils.ts';
export { DocTemplate } from './doc-template.tsx';
export { extractFencedCode } from './markdown.ts';
export { NameColorBadge, nameToColor } from './name-color-badge.tsx';
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
