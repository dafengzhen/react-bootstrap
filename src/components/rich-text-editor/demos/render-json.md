```tsx
import { useState } from 'react';

import { type NodeJSON, RichTextEditor, RichTextRenderer } from '@dafengzhen/react-bootstrap/rich-text-editor';

const initialContent: NodeJSON = {
  content: [
    {
      attrs: { level: 2 },
      content: [{ text: '把写作内容变成帖子详情', type: 'text' }],
      type: 'heading',
    },
    {
      content: [
        { text: '正文来自编辑器导出的 JSON，', type: 'text' },
        { marks: [{ type: 'bold' }], text: '展示方式由业务决定。', type: 'text' },
      ],
      type: 'paragraph',
    },
    {
      content: [
        {
          content: [{ text: '试着修改左侧正文，右侧预览会同步更新。', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'blockquote',
    },
    {
      attrs: { id: 'writing-guide', kind: 'related-post', title: '延伸阅读：如何设计内容展示页' },
      type: 'custom_block',
    },
  ],
  type: 'doc',
};

export function RenderJSONDemo() {
  const [content, setContent] = useState(initialContent);
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <p className="small text-muted">编辑内容</p>
        <RichTextEditor
          content={initialContent}
          hideToolbar
          onChange={(editor) => setContent(editor.getJSON())}
        />
      </div>
      <div className="col-lg-6">
        <article aria-label="帖子详情预览" className="border rounded-3 p-4">
          <header className="small text-muted mb-3">社区精选 · 作者小林 · 5 分钟阅读</header>
          <RichTextRenderer
            content={content}
            markRenderers={{
              bold: ({ children }) => <strong className="text-primary">{children}</strong>,
            }}
            nodeRenderers={{
              blockquote: ({ children }) => (
                <aside className="border-start border-primary border-3 ps-3 text-muted">
                  {children}
                </aside>
              ),
              custom_block: ({ defaultRender, node }) =>
                node.attrs?.kind === 'related-post' ? (
                  <a
                    className="d-block border rounded bg-body-tertiary p-3 text-decoration-none"
                    href={`#${encodeURIComponent(String(node.attrs.id))}`}
                  >
                    <span className="d-block small text-muted">推荐帖子</span>
                    <strong>{String(node.attrs.title ?? '')}</strong>
                  </a>
                ) : (
                  defaultRender()
                ),
              heading: ({ children }) => <h3 className="h4 mb-3">{children}</h3>,
            }}
            style={{ lineHeight: 1.8 }}
          />
          <footer className="border-top mt-4 pt-3 small text-muted">
            12 人觉得有帮助 · 3 条讨论
          </footer>
        </article>
      </div>
    </div>
  );
}
```
