```tsx
import { RichTextEditor } from '@dafengzhen/react-bootstrap/rich-text-editor';

export const Example = () => (
  <>
    <RichTextEditor
      content="<p>只读模式下工具栏按钮全部禁用，正文不可编辑，但仍可选中与复制。</p>"
      editable={false}
    />
    <RichTextEditor className="mt-3" hideToolbar placeholder="请输入内容" />
  </>
);
```
