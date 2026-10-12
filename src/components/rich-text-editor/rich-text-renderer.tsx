import {
  createElement,
  type CSSProperties,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import type { NodeJSON } from './rich-text-editor-lib';

import {
  frameReferrerPolicy,
  frameSandbox,
  frameUrl,
  videoFrameUrl,
} from './lib/serialization/media-frame';
import {
  cssLength,
  inlineStyleValue,
  linkTargetValue,
  numberValue,
  safeLinkRel,
  spacingModelValue,
} from './lib/serialization/presentation';
import { sanitizeUrl } from './lib/serialization/sanitize';

export type RichTextMarkJSON = NonNullable<NodeJSON['marks']>[number];

export interface RichTextMarkRenderContext {
  children: ReactNode;
  defaultRender: () => ReactNode;
  mark: RichTextMarkJSON;
  node: NodeJSON;
  path: readonly number[];
}

export type RichTextMarkRenderer = (context: RichTextMarkRenderContext) => ReactNode;

export interface RichTextNodeRenderContext {
  children: ReactNode;
  /** Built-in output for this node, including customized descendants. */
  defaultRender: () => ReactNode;
  node: NodeJSON;
  parent: NodeJSON | null;
  /** Child indexes from the root, which has an empty path. */
  path: readonly number[];
}
/** Return undefined to fall back; return null to hide a node or mark and its content. */
export type RichTextNodeRenderer = (context: RichTextNodeRenderContext) => ReactNode;

export interface RichTextRendererProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content' | 'dangerouslySetInnerHTML'>,
    RichTextRenderOptions {
  content?: NodeJSON | null;
}

export interface RichTextRenderOptions {
  markRenderers?: Readonly<Record<string, RichTextMarkRenderer>>;
  /** Type-specific renderer takes precedence over the global callback. */
  nodeRenderers?: Readonly<Record<string, RichTextNodeRenderer>>;
  renderMark?: RichTextMarkRenderer;
  renderNode?: RichTextNodeRenderer;
}

/** Render stored JSON as React elements without creating an editor or using the DOM. */
export function renderRichTextContent(
  content: NodeJSON | null | undefined,
  options: RichTextRenderOptions = {},
): ReactNode {
  const visit = (node: NodeJSON, parent: NodeJSON | null, path: readonly number[]): ReactNode => {
    const children =
      node.type === 'text'
        ? (node.text ?? '')
        : node.content?.map((child, index) => (
            <Fragment key={index}>{visit(child, node, [...path, index])}</Fragment>
          ));
    const defaultRender = () => renderDefaultNode(node, children);
    const context = { children, defaultRender, node, parent, path };
    let result = ownRenderer(options.nodeRenderers, node.type)?.(context);
    if (result === undefined) {
      result = options.renderNode?.(context);
    }
    if (result === undefined) {
      result = defaultRender();
    }
    // Marks are stored outermost first, so apply them from the inside out.
    for (const mark of [...(node.marks ?? [])].reverse()) {
      const children = result;
      const defaultRender = () => renderDefaultMark(mark, children);
      const context = { children, defaultRender, mark, node, path };
      result = ownRenderer(options.markRenderers, mark.type)?.(context);
      if (result === undefined) {
        result = options.renderMark?.(context);
      }
      if (result === undefined) {
        result = defaultRender();
      }
    }
    return result;
  };
  return content ? visit(content, null, []) : null;
}

export function RichTextRenderer({
  content,
  markRenderers,
  nodeRenderers,
  renderMark,
  renderNode,
  style,
  ...rest
}: RichTextRendererProps) {
  return (
    <div {...rest} style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', ...style }}>
      {renderRichTextContent(content, { markRenderers, nodeRenderers, renderMark, renderNode })}
    </div>
  );
}

function blockStyle(attrs: NonNullable<NodeJSON['attrs']>): CSSProperties {
  const style: CSSProperties = {};
  if (['center', 'justify', 'left', 'right'].includes(String(attrs.align))) {
    style.textAlign = attrs.align as CSSProperties['textAlign'];
  }
  if (attrs.lineHeight != null) {
    style.lineHeight =
      numberValue(attrs.lineHeight) ?? cssLength(String(attrs.lineHeight)) ?? undefined;
  }
  for (const name of ['marginTop', 'marginBottom'] as const) {
    if (attrs[name] != null) {
      style[name] =
        spacingModelValue(
          typeof attrs[name] === 'number' ? `${attrs[name]}px` : String(attrs[name]),
        ) ?? undefined;
    }
  }
  const indent = numberValue(attrs.indent);
  if (indent !== null && Number.isInteger(indent) && indent > 0) {
    style.paddingInlineStart = `${Math.min(indent, 8) * 2}em`;
  }
  return style;
}

function ownRenderer<T>(
  renderers: Readonly<Record<string, T>> | undefined,
  type: string,
): T | undefined {
  return renderers && Object.hasOwn(renderers, type) ? renderers[type] : undefined;
}

function positive(value: unknown, fallback?: number): number | undefined {
  const number = numberValue(value);
  return number !== null && number > 0 ? number : fallback;
}

function renderDefaultMark(mark: RichTextMarkJSON, children: ReactNode): ReactNode {
  const attrs = mark.attrs ?? {};
  switch (mark.type) {
    case 'bold':
      return <strong>{children}</strong>;
    case 'font_family':
      return (
        <span style={{ fontFamily: inlineStyleValue('font-family', attrs.family) ?? undefined }}>
          {children}
        </span>
      );
    case 'font_size':
      return (
        <span style={{ fontSize: inlineStyleValue('font-size', attrs.size) ?? undefined }}>
          {children}
        </span>
      );
    case 'highlight':
      return (
        <mark style={{ backgroundColor: inlineStyleValue('color', attrs.color) ?? undefined }}>
          {children}
        </mark>
      );
    case 'inline_code':
      return <code>{children}</code>;
    case 'italic':
      return <em>{children}</em>;
    case 'link':
      return (
        <a
          href={url(attrs.href)}
          rel={safeLinkRel(attrs.target, attrs.rel) ?? undefined}
          target={linkTargetValue(attrs.target) ?? undefined}
          title={string(attrs.title)}
        >
          {children}
        </a>
      );
    case 'strike':
      return <s>{children}</s>;
    case 'subscript':
      return <sub>{children}</sub>;
    case 'superscript':
      return <sup>{children}</sup>;
    case 'text_color':
      return (
        <span style={{ color: inlineStyleValue('color', attrs.color) ?? undefined }}>
          {children}
        </span>
      );
    case 'underline':
      return <u>{children}</u>;
    default:
      return children;
  }
}

function renderDefaultNode(node: NodeJSON, children: ReactNode): ReactNode {
  const attrs = node.attrs ?? {};
  switch (node.type) {
    case 'attachment':
      return (
        <a download href={url(attrs.url)}>
          {string(attrs.name) ?? string(attrs.title) ?? 'Attachment'}
        </a>
      );
    case 'audio':
      return url(attrs.src) ? (
        // Exported media has no caption track; hosts can supply one through nodeRenderers.
        // oxlint-disable-next-line jsx-a11y/media-has-caption
        <audio controls src={url(attrs.src)} title={string(attrs.title)} />
      ) : null;
    case 'blockquote':
      return <blockquote>{children}</blockquote>;
    case 'bullet_list':
      return <ul>{children}</ul>;
    case 'code_block':
      return (
        <pre>
          <code data-language={string(attrs.language)}>{children}</code>
        </pre>
      );
    // Stored HTML is metadata, never executable markup. Hosts can provide a business card renderer.
    case 'custom_block':
      return <div data-card-kind={string(attrs.kind)}>{string(attrs.title) ?? children}</div>;
    case 'date':
      return (
        <time dateTime={string(attrs.datetime)}>
          {string(attrs.label) ?? string(attrs.datetime)}
        </time>
      );
    case 'doc':
    case 'text':
      return children;
    case 'embed':
    case 'video': {
      const source =
        node.type === 'video'
          ? videoFrameUrl(attrs.provider, attrs.id, attrs.url)
          : frameUrl(attrs.url);
      if (node.type === 'video' && (attrs.provider === 'native' || !attrs.provider)) {
        return url(attrs.url) ? (
          // Exported media has no caption track; hosts can supply one through nodeRenderers.
          // oxlint-disable-next-line jsx-a11y/media-has-caption
          <video
            controls
            height={positive(attrs.height)}
            poster={url(attrs.poster)}
            src={url(attrs.url)}
            style={{ maxWidth: '100%' }}
            width={positive(attrs.width)}
          />
        ) : null;
      }
      return source ? (
        <iframe
          allowFullScreen
          height={positive(attrs.height, 360)}
          referrerPolicy={frameReferrerPolicy(source)}
          sandbox={frameSandbox(source)}
          src={source}
          style={{ border: 0, maxWidth: '100%' }}
          title={string(attrs.title) ?? node.type}
          width={positive(attrs.width, 640)}
        />
      ) : (
        <div>{string(attrs.title) ?? string(attrs.provider) ?? 'Embed'}</div>
      );
    }
    case 'emoji':
    case 'symbol':
      return <span title={string(attrs.name)}>{string(attrs.char)}</span>;
    case 'hard_break':
      return <br />;
    case 'heading': {
      const level = numberValue(attrs.level) ?? 1;
      return createElement(
        `h${Number.isInteger(level) && level >= 1 && level <= 6 ? level : 1}`,
        { style: blockStyle(attrs) },
        children,
      );
    }
    case 'horizontal_rule':
      return <hr />;
    case 'image':
      return url(attrs.src) ? (
        <img
          alt={string(attrs.alt) ?? ''}
          height={positive(attrs.height)}
          loading="lazy"
          src={url(attrs.src)}
          style={{ maxWidth: '100%' }}
          title={string(attrs.title)}
          width={positive(attrs.width)}
        />
      ) : null;
    case 'list_item':
      return <li>{children}</li>;
    case 'ordered_list':
      return <ol start={positive(attrs.order, 1)}>{children}</ol>;
    case 'paragraph':
      return <p style={blockStyle(attrs)}>{node.content?.length ? children : <br />}</p>;
    case 'table':
      return (
        <table>
          <tbody>{children}</tbody>
        </table>
      );
    case 'table_cell':
      return (
        <td colSpan={positive(attrs.colspan, 1)} rowSpan={positive(attrs.rowspan, 1)}>
          {children}
        </td>
      );
    case 'table_row':
      return <tr>{children}</tr>;
    case 'task_item':
      return (
        <li>
          <input aria-label="Task" checked={attrs.checked === true} disabled type="checkbox" />
          {children}
        </li>
      );
    case 'task_list':
      return <ul style={{ listStyle: 'none', paddingInlineStart: 0 }}>{children}</ul>;
    default:
      return children;
  }
}

function string(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function url(value: unknown): string | undefined {
  return typeof value === 'string' ? sanitizeUrl(value) || undefined : undefined;
}
