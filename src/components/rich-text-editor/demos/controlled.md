```tsx
import { useRef } from 'react';
import { Button } from '@dafengzhen/react-bootstrap/button';
import {
  RichTextEditor,
  type RichTextEditorHandle,
} from '@dafengzhen/react-bootstrap/rich-text-editor';

export const Example = () => {
  const editorRef = useRef<RichTextEditorHandle>(null);

  return (
    <>
      <RichTextEditor
        content="<h2>受控文档</h2><p>下面的按钮通过 ref 读取和写入文档。</p>"
        ref={editorRef}
      />
      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button onClick={() => editorRef.current?.setHTML('<p>整篇内容被替换</p>')} size="sm">
          替换内容
        </Button>
        <Button
          onClick={() => alert(editorRef.current?.getHTML())}
          size="sm"
          variant="outline-secondary"
        >
          查看 HTML
        </Button>
        <Button
          onClick={() => alert(editorRef.current?.getMarkdown())}
          size="sm"
          variant="outline-secondary"
        >
          查看 Markdown
        </Button>
        <Button onClick={() => editorRef.current?.focus()} size="sm" variant="outline-secondary">
          聚焦编辑器
        </Button>
      </div>
    </>
  );
};
```
