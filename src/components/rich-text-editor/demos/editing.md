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
        content="<p>试试 Ctrl+Z 撤销、Ctrl+Shift+Z 重做、Ctrl+F 查找替换、Ctrl+K 插入链接、Ctrl+Shift+C 格式刷。</p>"
        ref={editorRef}
      />
      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button onClick={() => editorRef.current?.undo()} size="sm" variant="outline-secondary">
          撤销
        </Button>
        <Button onClick={() => editorRef.current?.redo()} size="sm" variant="outline-secondary">
          重做
        </Button>
        <Button
          onClick={() => alert(editorRef.current?.getText())}
          size="sm"
          variant="outline-secondary"
        >
          查看纯文本
        </Button>
      </div>
    </>
  );
};
```
