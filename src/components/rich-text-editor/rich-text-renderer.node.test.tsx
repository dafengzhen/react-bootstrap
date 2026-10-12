import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { NodeJSON } from './rich-text-editor-lib';

import { extendedKit } from './rich-text-editor-extensions';
import { Editor, MediaKit, StarterKit, TableKit } from './rich-text-editor-lib';
import { renderRichTextContent, RichTextRenderer } from './rich-text-renderer';

const text = (value: string): NodeJSON => ({ text: value, type: 'text' });
const doc = (...content: NodeJSON[]): NodeJSON => ({ content, type: 'doc' });

describe('RichTextRenderer', () => {
  it('renders exported editor JSON on the server with nested formatting and table structure', () => {
    const editor = new Editor({
      content: doc(
        { attrs: { level: 2 }, content: [text('Post')], type: 'heading' },
        {
          attrs: { align: 'center', lineHeight: 1.8 },
          content: [{ ...text('<Hello>'), marks: [{ type: 'bold' }, { type: 'italic' }] }],
          type: 'paragraph',
        },
        {
          content: [
            {
              content: [
                {
                  attrs: { colspan: 2 },
                  content: [{ content: [text('Cell')], type: 'paragraph' }],
                  type: 'table_cell',
                },
              ],
              type: 'table_row',
            },
          ],
          type: 'table',
        },
        {
          content: [{ attrs: { datetime: '2026-10-13', label: 'Today' }, type: 'date' }],
          type: 'paragraph',
        },
      ),
      extensions: [StarterKit, MediaKit, TableKit, extendedKit()],
    });
    try {
      const html = renderToStaticMarkup(
        <RichTextRenderer className="post" content={editor.getJSON()} />,
      );
      expect(html).toMatch(/<h2[^>]*>Post<\/h2>/);
      expect(html).toContain('text-align:center;line-height:1.8');
      expect(html).toContain('<strong><em>&lt;Hello&gt;</em></strong>');
      expect(html).toContain('<table><tbody><tr><td colSpan="2"');
      expect(html).toContain('<time dateTime="2026-10-13">Today</time>');
    } finally {
      editor.destroy();
    }
  });

  it('allows type-specific and global custom views with parent, path and a default fallback', () => {
    const content = doc(
      { content: [{ ...text('hello'), marks: [{ type: 'bold' }] }], type: 'paragraph' },
      { attrs: { title: 'Related' }, type: 'custom_block' },
    );
    const paths: number[][] = [];
    const html = renderToStaticMarkup(
      <RichTextRenderer
        content={content}
        markRenderers={{
          bold: ({ children, node, path }) => {
            expect(path).toEqual([0, 0]);
            expect(node.type).toBe('text');
            return <b className="brand">{children}</b>;
          },
        }}
        nodeRenderers={{
          paragraph: ({ defaultRender, parent, path }) => {
            expect(parent?.type).toBe('doc');
            paths.push([...path]);
            return <section>{defaultRender()}</section>;
          },
        }}
        renderMark={() => {
          throw new Error('type-specific mark should take precedence');
        }}
        renderNode={({ node }) =>
          node.type === 'custom_block' ? <aside>{String(node.attrs?.title)}</aside> : undefined
        }
      />,
    );
    expect(paths).toEqual([[0]]);
    expect(html).toContain('<section><p><b class="brand">hello</b></p></section>');
    expect(html).toContain('<aside>Related</aside>');
  });

  it('preserves unknown children and supports undefined fallback, null omission and mark unwrapping', () => {
    const content = doc(
      { content: [text('kept')], type: 'unknown' },
      { content: [text('hidden')], type: 'paragraph' },
      { ...text('plain'), marks: [{ type: 'bold' }, { type: 'unknown' }] },
    );
    const html = renderToStaticMarkup(
      <>
        {renderRichTextContent(content, {
          markRenderers: { bold: ({ children }) => children },
          nodeRenderers: { paragraph: () => null, unknown: () => undefined },
        })}
      </>,
    );
    expect(html).toBe('keptplain');
    expect(renderRichTextContent(null)).toBeNull();
    expect(renderToStaticMarkup(<RichTextRenderer />)).toContain('></div>');
  });

  it('refuses unsafe URLs and raw HTML while protecting blank links and frame permissions', () => {
    const content = doc(
      {
        content: [
          {
            ...text('link'),
            marks: [
              {
                attrs: { href: 'javascript:alert(1)', rel: 'opener', target: '_blank' },
                type: 'link',
              },
            ],
          },
        ],
        type: 'paragraph',
      },
      { attrs: { src: 'data:image/svg+xml,<svg onload="alert(1)" />' }, type: 'image' },
      { attrs: { html: '<script>alert(1)</script>', title: '<b>Card</b>' }, type: 'custom_block' },
      {
        attrs: { html: '<iframe srcdoc="evil" />', title: 'Embed', url: 'javascript:alert(1)' },
        type: 'embed',
      },
      { attrs: { title: 'Safe', url: 'https://example.com/embed' }, type: 'embed' },
    );
    const html = renderToStaticMarkup(<RichTextRenderer content={content} />);
    expect(html).not.toMatch(/javascript:|onload|srcdoc|<script|\bopener\b/);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('&lt;b&gt;Card&lt;/b&gt;');
    expect(html).toContain('sandbox="allow-scripts allow-presentation"');
    expect(html).toContain('src="https://example.com/embed"');
  });

  it('handles empty paragraphs and prototype-named unknown nodes without invoking inherited properties', () => {
    const html = renderToStaticMarkup(
      <RichTextRenderer
        content={doc(
          { content: [], type: 'paragraph' },
          { content: [{ ...text('unknown'), marks: [{ type: 'toString' }] }], type: 'constructor' },
        )}
        markRenderers={{}}
        nodeRenderers={{}}
      />,
    );
    expect(html).toContain('><p><br/></p>unknown</div>');
  });
});
