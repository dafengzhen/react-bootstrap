```tsx
type RichTextMarkJSON = NonNullable<NodeJSON['marks']>[number];

interface RichTextNodeRenderContext {
  node: NodeJSON;
  parent: NodeJSON | null;
  path: readonly number[];
  children: ReactNode;
  defaultRender: () => ReactNode;
}

interface RichTextMarkRenderContext {
  mark: RichTextMarkJSON;
  node: NodeJSON;
  path: readonly number[];
  children: ReactNode;
  defaultRender: () => ReactNode;
}

type RichTextNodeRenderer = (context: RichTextNodeRenderContext) => ReactNode;
type RichTextMarkRenderer = (context: RichTextMarkRenderContext) => ReactNode;

interface RichTextRenderOptions {
  nodeRenderers?: Readonly<Record<string, RichTextNodeRenderer>>;
  markRenderers?: Readonly<Record<string, RichTextMarkRenderer>>;
  renderNode?: RichTextNodeRenderer;
  renderMark?: RichTextMarkRenderer;
}

interface RichTextRendererProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content' | 'dangerouslySetInnerHTML'>,
    RichTextRenderOptions {
  content?: NodeJSON | null;
}

function renderRichTextContent(
  content: NodeJSON | null | undefined,
  options?: RichTextRenderOptions,
): ReactNode;
```
