```tsx
import { useState } from 'react';
import { RichTextEditor } from '@dafengzhen/react-bootstrap/rich-text-editor';
import '@dafengzhen/react-bootstrap/rich-text-editor/style';

export const Example = () => {
  const [html, setHtml] = useState('');

  return (
    <>
      <RichTextEditor
        content="<p>Hello <strong>world</strong>，在这里开始写作…</p>"
        onHTMLChange={setHtml}
        placeholder="请输入内容"
      />
      <pre className="mt-3 small">{html}</pre>
    </>
  );
};
```
